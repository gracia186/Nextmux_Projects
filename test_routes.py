import requests
import json
import subprocess
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000/api/v1"
HEADERS = {"Content-Type": "application/json", "Accept": "application/json"}

resultats = []
token_admin = None
token_mentor = None
token_intern = None
admin_id = None
mentor_id = None
intern_id = None
internship_id = None
project_id = None
task_id = None
report_id = None
report_id_2 = None
document_id = None
event_id = None
attendance_id = None

DUMMY_PDF = b"%PDF-1.4\n%mock pdf content for testing\n%%EOF"


def test(nom, methode, url, data=None, headers=None, attendu=None):
    h = {**HEADERS}
    if headers:
        h.update(headers)
    try:
        resp = getattr(requests, methode)(f"{BASE_URL}{url}", json=data, headers=h, timeout=10)
        ok = resp.status_code in (attendu or [200, 201])
        status = "✅ PASS" if ok else "❌ FAIL"
        print(f"{status} [{resp.status_code}] {methode.upper()} {url}")
        if not ok:
            try:
                print(f"       Erreur: {json.dumps(resp.json(), ensure_ascii=False, indent=2)[:400]}")
            except:
                print(f"       Body: {resp.text[:200]}")
        resultats.append({"nom": nom, "ok": ok, "status": resp.status_code, "url": url})
        return resp
    except Exception as e:
        print(f"💥 ERREUR [{methode.upper()} {url}] : {e}")
        resultats.append({"nom": nom, "ok": False, "status": 0, "url": url})
        return None


def test_multipart(nom, methode, url, files=None, data=None, headers=None, attendu=None):
    """Pour les endpoints qui reçoivent des fichiers (multipart/form-data)."""
    h = {"Accept": "application/json"}
    if headers:
        h.update(headers)
    try:
        resp = getattr(requests, methode)(
            f"{BASE_URL}{url}", data=data, files=files, headers=h, timeout=15
        )
        ok = resp.status_code in (attendu or [200, 201])
        status = "✅ PASS" if ok else "❌ FAIL"
        print(f"{status} [{resp.status_code}] {methode.upper()} {url}")
        if not ok:
            try:
                print(f"       Erreur: {json.dumps(resp.json(), ensure_ascii=False, indent=2)[:400]}")
            except:
                print(f"       Body: {resp.text[:200]}")
        resultats.append({"nom": nom, "ok": ok, "status": resp.status_code, "url": url})
        return resp
    except Exception as e:
        print(f"💥 ERREUR [{methode.upper()} {url}] : {e}")
        resultats.append({"nom": nom, "ok": False, "status": 0, "url": url})
        return None


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def tinker(cmd):
    """Version validée par test_tinker.py — sans shell=True, avec marqueurs
    précis au lieu d'un filtre approximatif sur des mots-clés d'erreur."""
    marker = "###R###"
    full_code = f"echo '{marker}'; {cmd} echo '{marker}';"
    result = subprocess.run(
        ["php", "artisan", "tinker", "--execute", full_code],
        capture_output=True, text=True, cwd="F:\\nextmux-backend"
    )
    output = result.stdout
    parts = output.split(marker)
    if len(parts) >= 3:
        return parts[1].strip()
    return ""


print("\n" + "="*60)
print("   NEXTMUX — TEST AUTOMATIQUE DES ROUTES API")
print("   " + datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
print("="*60 + "\n")

# ============================================================
# AUTH
# ============================================================
print("── AUTH ────────────────────────────────────────────────")

r = test("Login Admin", "post", "/auth/login",
    data={"email": "admin@nextmux.com", "password": "password"})
if r and r.status_code == 200:
    token_admin = r.json()["data"]["token"]
    admin_id = r.json()["data"]["user"]["id"]
    print(f"   → Token admin obtenu")

test("Login invalide", "post", "/auth/login",
    data={"email": "faux@faux.com", "password": "mauvais"},
    attendu=[401, 422])

test("Forgot password", "post", "/auth/forgot-password",
    data={"email": "admin@nextmux.com"})

test("Invitation token invalide", "get", "/auth/invitation/TOKENINVALIDE",
    attendu=[404])

# ============================================================
# LOGIN MENTOR ET INTERN
# On part de l'Internship qui a un mentor_id, pas de User::internship()
# — cette relation n'existe pas sur le modèle User (BadMethodCallException
# confirmée). On déduit intern et mentor depuis Internship.
# ============================================================
print("\n── LOGIN MENTOR ET STAGIAIRE ───────────────────────────")

internship_id = tinker("echo App\\Models\\Internship::whereNotNull('mentor_id')->first()?->id;")
intern_id = tinker(f"echo App\\Models\\Internship::find('{internship_id}')?->intern_id;") if internship_id else ""
mentor_id = tinker(f"echo App\\Models\\Internship::find('{internship_id}')?->mentor_id;") if internship_id else ""

intern_email = tinker(f"echo App\\Models\\User::find('{intern_id}')?->email;") if intern_id else ""
mentor_email = tinker(f"echo App\\Models\\User::find('{mentor_id}')?->email;") if mentor_id else ""

if mentor_email:
    r = test("Login Mentor", "post", "/auth/login",
        data={"email": mentor_email, "password": "password"})
    if r and r.status_code == 200:
        token_mentor = r.json()["data"]["token"]
        mentor_id = r.json()["data"]["user"]["id"]
        print(f"   → Token mentor obtenu (assigné au stage testé)")
else:
    print("   ⚠ Aucun mentor assigné à ce stage — les tests mentor seront ignorés")

if intern_email:
    r = test("Login Intern", "post", "/auth/login",
        data={"email": intern_email, "password": "password"})
    if r and r.status_code == 200:
        token_intern = r.json()["data"]["token"]
        print(f"   → Token intern obtenu")
else:
    print("   ⚠ Email intern vide — vérifier internship_id/intern_id via tinker manuel")

# ============================================================
# ME
# ============================================================
print("\n── ME ──────────────────────────────────────────────────")

if token_admin:
    test("Mon profil (admin)", "get", "/me", headers=auth(token_admin))
    test("Modifier profil", "patch", "/me",
        data={"name": "Admin NEXTMUX"}, headers=auth(token_admin))
    test("Mes notifications", "get", "/me/notifications", headers=auth(token_admin))
    test("Marquer notifications lues", "post", "/me/notifications/read",
        headers=auth(token_admin))
    test("Export RGPD", "get", "/me/data-export", headers=auth(token_admin))

# ============================================================
# ADMIN — UTILISATEURS
# ============================================================
print("\n── ADMIN — UTILISATEURS ────────────────────────────────")

if token_admin:
    test("Liste utilisateurs", "get", "/admin/users", headers=auth(token_admin))
    test("Détail utilisateur", "get", f"/admin/users/{admin_id}",
        headers=auth(token_admin))

    r = test("Créer mentor test", "post", "/admin/users",
        data={"name": "Mentor Test Script", "email": f"mentortest{datetime.now().timestamp():.0f}@test.com", "role": "mentor"},
        headers=auth(token_admin))
    new_mentor_id = r.json()["data"]["id"] if r and r.status_code == 201 else None

    r = test("Créer stagiaire test", "post", "/admin/users",
        data={
            "name": "Intern Test Script",
            "email": f"interntest{datetime.now().timestamp():.0f}@test.com",
            "role": "intern",
            "start_date": "2026-01-01",
            "end_date": "2026-12-31",
        },
        headers=auth(token_admin))
    new_intern_id = r.json()["data"]["id"] if r and r.status_code == 201 else None

    if new_intern_id:
        test("Modifier utilisateur", "patch", f"/admin/users/{new_intern_id}",
            data={"name": "Intern Test Modifié"}, headers=auth(token_admin))

    if new_mentor_id and new_intern_id:
        test("Assigner mentor", "post", f"/admin/users/{new_intern_id}/assign-mentor",
            data={"mentor_id": new_mentor_id}, headers=auth(token_admin))

    if new_intern_id:
        test("Renvoyer invitation", "post", f"/admin/users/{new_intern_id}/resend-invitation",
            headers=auth(token_admin))

# ============================================================
# ADMIN — STATS
# ============================================================
print("\n── ADMIN — STATISTIQUES ────────────────────────────────")

if token_admin:
    test("Stats overview", "get", "/admin/stats/overview", headers=auth(token_admin))
    test("Stats attendance", "get", "/admin/stats/attendance", headers=auth(token_admin))
    test("Stats reports", "get", "/admin/stats/reports", headers=auth(token_admin))
    test("Stats documents", "get", "/admin/stats/documents", headers=auth(token_admin))

# ============================================================
# ATTENDANCE
# ============================================================
print("\n── ATTENDANCE ──────────────────────────────────────────")

today = datetime.now().strftime("%Y-%m-%d")
tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

if token_intern:
    r = test("Pointer présence (present)", "post", "/attendance",
        data={"status": "present", "arrival_time": "08:30"},
        headers=auth(token_intern))
    if r and r.status_code == 201:
        attendance_id = r.json()["data"]["id"]

    test("Double pointage (doit échouer)", "post", "/attendance",
        data={"status": "present"},
        headers=auth(token_intern), attendu=[422, 409])

    test("Retard sans motif (doit échouer)", "post", "/attendance",
        data={"status": "late", "date": tomorrow},
        headers=auth(token_intern), attendu=[422])

    test("Absence justifiée sans motif (doit échouer)", "post", "/attendance",
        data={"status": "absent_justified", "date": tomorrow},
        headers=auth(token_intern), attendu=[422])

    test("Historique présences", "get", "/attendance", headers=auth(token_intern))

    if attendance_id:
        test("Signaler départ", "patch", f"/attendance/{attendance_id}/departure",
            headers=auth(token_intern), attendu=[200])

        test("Signaler départ deux fois (doit échouer)", "patch", f"/attendance/{attendance_id}/departure",
            headers=auth(token_intern), attendu=[409])

if token_admin:
    test("Dashboard présences (admin)", "get", "/attendance/dashboard",
        headers=auth(token_admin))

if token_mentor:
    test("Dashboard présences (mentor)", "get", "/attendance/dashboard",
        headers=auth(token_mentor))

if intern_id and token_admin:
    test("Présences par stagiaire", "get", f"/attendance/{intern_id}",
        headers=auth(token_admin))

# ============================================================
# REPORTS
# ============================================================
print("\n── REPORTS ─────────────────────────────────────────────")

if token_intern:
    files = {"file": ("rapport.pdf", DUMMY_PDF, "application/pdf")}
    data = {
        "type": "weekly",
        "period_start": today,
        "period_end": today,
    }
    r = test_multipart("Soumettre rapport", "post", "/reports",
        files=files, data=data, headers=auth(token_intern))
    if r and r.status_code == 201:
        report_id = r.json()["data"]["id"]

    r2 = test_multipart("Soumettre 2e rapport", "post", "/reports",
        files={"file": ("rapport2.pdf", DUMMY_PDF, "application/pdf")},
        data={"type": "weekly", "period_start": today, "period_end": today},
        headers=auth(token_intern))
    if r2 and r2.status_code == 201:
        report_id_2 = r2.json()["data"]["id"]

    test("Liste rapports (intern)", "get", "/reports", headers=auth(token_intern))

    if report_id:
        test("Détail rapport", "get", f"/reports/{report_id}", headers=auth(token_intern))
        test("Modifier rapport pending", "patch", f"/reports/{report_id}",
            data={"type": "monthly"}, headers=auth(token_intern))

if token_mentor:
    test("Rapports en attente (mentor)", "get", "/reports/pending", headers=auth(token_mentor))
    test("Liste complète rapports (mentor)", "get", "/reports", headers=auth(token_mentor))

    if report_id:
        r = test("Valider rapport (mentor)", "post", f"/reports/{report_id}/validate",
            data={"status": "validated", "mentor_comment": "RAS"},
            headers=auth(token_mentor))

if token_intern and report_id:
    test("Modifier rapport déjà validé (doit échouer)", "patch", f"/reports/{report_id}",
        data={"type": "monthly"}, headers=auth(token_intern), attendu=[403])

if token_intern and report_id_2:
    test("Masquer rapport (delete)", "delete", f"/reports/{report_id_2}",
        headers=auth(token_intern))

    r = test("Liste rapports après masquage", "get", "/reports", headers=auth(token_intern))
    if r and r.status_code == 200:
        ids_visibles = [rep["id"] for rep in r.json()["data"]]
        if report_id_2 not in ids_visibles:
            print("   ✅ Rapport bien masqué de la liste du stagiaire")
        else:
            print("   ❌ ALERTE : le rapport masqué apparaît encore dans la liste du stagiaire")

if token_mentor and report_id_2:
    r = test("Mentor voit toujours le rapport masqué", "get", f"/reports/{report_id_2}",
        headers=auth(token_mentor))

# ============================================================
# PROJECTS
# ============================================================
print("\n── PROJECTS ────────────────────────────────────────────")

if token_mentor:
    r = test("Créer projet", "post", "/projects",
        data={
            "title": "Projet Test Script",
            "description": "Description test",
            "objectives": "Objectifs test",
            "start_date": "2026-01-01",
        },
        headers=auth(token_mentor))
    if r and r.status_code == 201:
        project_id = r.json()["data"]["id"]

    test("Liste projets (mentor)", "get", "/projects", headers=auth(token_mentor))

    if project_id:
        test("Détail projet", "get", f"/projects/{project_id}",
            headers=auth(token_mentor))
        test("Modifier projet", "patch", f"/projects/{project_id}",
            data={"title": "Projet Modifié"}, headers=auth(token_mentor))
        test("Mettre à jour avancement", "patch", f"/projects/{project_id}/progress",
            data={"progress": 50}, headers=auth(token_mentor))

        if intern_id:
            test("Assigner stagiaires", "post", f"/projects/{project_id}/assign",
                data={"intern_ids": [intern_id]}, headers=auth(token_mentor))

if token_intern:
    test("Liste projets (stagiaire)", "get", "/projects", headers=auth(token_intern))

# ============================================================
# TASKS
# ============================================================
print("\n── TASKS ───────────────────────────────────────────────")

if token_mentor and project_id:
    r = test("Créer tâche", "post", f"/projects/{project_id}/tasks",
        data={"title": "Tâche Test Script", "description": "Description test"},
        headers=auth(token_mentor))
    if r and r.status_code == 201:
        task_id = r.json()["data"]["id"]

    test("Liste tâches projet", "get", f"/projects/{project_id}/tasks",
        headers=auth(token_mentor))

    if task_id:
        test("Détail tâche", "get", f"/tasks/{task_id}", headers=auth(token_mentor))
        test("Changer statut (mentor)", "patch", f"/tasks/{task_id}/status",
            data={"status": "in_progress"}, headers=auth(token_mentor))

if token_intern and task_id:
    test("Changer statut (stagiaire)", "patch", f"/tasks/{task_id}/status",
        data={"status": "done"}, headers=auth(token_intern))

# ============================================================
# DOCUMENTS
# ============================================================
print("\n── DOCUMENTS ───────────────────────────────────────────")

if token_intern:
    r = test("Demander attestation", "post", "/documents/request",
        data={"type": "attestation", "request_note": "Pour candidature"},
        headers=auth(token_intern))
    if r and r.status_code == 201:
        document_id = r.json()["data"]["id"]

    test("Mes documents", "get", "/documents", headers=auth(token_intern))

if token_mentor:
    test("Documents en attente (mentor)", "get", "/documents/pending", headers=auth(token_mentor))

    if document_id:
        test("Mentor valide la demande", "post", f"/documents/{document_id}/mentor-validate",
            data={"status": "approved"}, headers=auth(token_mentor))

if token_admin:
    test("Documents validés par mentor (admin)", "get", "/admin/documents/pending",
        headers=auth(token_admin))

    if document_id:
        files = {"file": ("attestation.pdf", DUMMY_PDF, "application/pdf")}
        test_multipart("Admin téléverse le fichier final", "post", f"/documents/{document_id}/upload",
            files=files, headers=auth(token_admin))

if token_intern and document_id:
    test("Télécharger document complété", "get", f"/documents/{document_id}/download",
        headers=auth(token_intern))

if token_intern and document_id:
    test("Stagiaire tente mentor-validate (doit échouer)", "post", f"/documents/{document_id}/mentor-validate",
        data={"status": "approved"}, headers=auth(token_intern), attendu=[403])

# ============================================================
# EVENTS
# ============================================================
print("\n── EVENTS ──────────────────────────────────────────────")

if token_admin:
    r = test("Publier événement (admin)", "post", "/events",
        data={
            "title": "Réunion Test Script",
            "content": "Contenu de la réunion",
            "audience": "all",
            "is_pinned": False,
        },
        headers=auth(token_admin))
    if r and r.status_code == 201:
        event_id = r.json()["data"]["id"]

    test("Liste événements (admin)", "get", "/events", headers=auth(token_admin))

    if event_id:
        test("Détail événement", "get", f"/events/{event_id}", headers=auth(token_admin))
        test("Modifier événement (admin)", "patch", f"/events/{event_id}",
            data={"title": "Réunion Modifiée"}, headers=auth(token_admin))

if token_mentor:
    test("Mentor publie événement (doit échouer)", "post", "/events",
        data={"title": "Test", "content": "Test", "audience": "all"},
        headers=auth(token_mentor), attendu=[403])

    if event_id:
        test("Mentor modifie événement admin (doit échouer)", "patch", f"/events/{event_id}",
            data={"title": "Hack"}, headers=auth(token_mentor), attendu=[403])
        test("Mentor supprime événement admin (doit échouer)", "delete", f"/events/{event_id}",
            headers=auth(token_mentor), attendu=[403])

if token_intern:
    test("Liste événements (stagiaire)", "get", "/events", headers=auth(token_intern))

# ============================================================
# SÉCURITÉ
# ============================================================
print("\n── SÉCURITÉ ────────────────────────────────────────────")

test("Me sans token", "get", "/me", attendu=[401])
test("Projects sans token", "get", "/projects", attendu=[401])
test("Admin sans token", "get", "/admin/users", attendu=[401])

if token_intern:
    test("Intern accède admin", "get", "/admin/users",
        headers=auth(token_intern), attendu=[403])
    test("Intern crée projet", "post", "/projects",
        data={"title": "Hack", "description": "...", "start_date": "2026-01-01"},
        headers=auth(token_intern), attendu=[403])

if token_mentor:
    test("Mentor accède admin stats", "get", "/admin/stats/overview",
        headers=auth(token_mentor), attendu=[403])

# ============================================================
# LOGOUT
# ============================================================
print("\n── LOGOUT ──────────────────────────────────────────────")

if token_admin:
    test("Logout admin", "post", "/auth/logout", headers=auth(token_admin))
if token_mentor:
    test("Logout mentor", "post", "/auth/logout", headers=auth(token_mentor))
if token_intern:
    test("Logout intern", "post", "/auth/logout", headers=auth(token_intern))

# ============================================================
# RÉSUMÉ
# ============================================================
print("\n" + "="*60)
print("   RÉSUMÉ DES TESTS")
print("="*60)

total = len(resultats)
passes = sum(1 for r in resultats if r["ok"])
fails = total - passes
taux = round((passes / total) * 100) if total > 0 else 0

print(f"\n   Total  : {total} routes testées")
print(f"   ✅ Pass : {passes}")
print(f"   ❌ Fail : {fails}")
print(f"   Taux   : {taux}%\n")

if fails > 0:
    print("Routes en échec :")
    for r in resultats:
        if not r["ok"]:
            print(f"   ❌ [{r['status']}] {r['url']} — {r['nom']}")

print("\n" + "="*60 + "\n")