import requests
import json
import sys
from datetime import datetime

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
document_id = None
event_id = None

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
                print(f"       Erreur: {json.dumps(resp.json(), ensure_ascii=False, indent=2)[:300]}")
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

print("\n" + "="*60)
print("   NEXTMUX — TEST AUTOMATIQUE DES ROUTES API")
print("   " + datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
print("="*60 + "\n")

# ============================================================
# AUTH — ROUTES PUBLIQUES
# ============================================================
print("── AUTH PUBLIQUES ──────────────────────────────────────")

r = test("Login Admin", "post", "/auth/login",
    data={"email": "admin@nextmux.com", "password": "password"})
if r and r.status_code == 200:
    data = r.json()
    token_admin = data["data"]["token"]
    admin_id = data["data"]["user"]["id"]
    print(f"   → Token admin obtenu : {token_admin[:30]}...")

test("Login invalide", "post", "/auth/login",
    data={"email": "faux@faux.com", "password": "mauvais"},
    attendu=[401, 422])

test("Invitation token invalide", "get", "/auth/invitation/TOKENINVALIDE",
    attendu=[404])

test("Forgot password", "post", "/auth/forgot-password",
    data={"email": "admin@nextmux.com"})

# ============================================================
# ME
# ============================================================
print("\n── ME ──────────────────────────────────────────────────")

if token_admin:
    r = test("Mon profil", "get", "/me", headers=auth(token_admin))
    test("Modifier mon profil", "patch", "/me",
        data={"name": "Admin NEXTMUX Modifié"}, headers=auth(token_admin))
    test("Mes notifications", "get", "/me/notifications", headers=auth(token_admin))
    test("Marquer notifications lues", "post", "/me/notifications/read",
        headers=auth(token_admin))
    test("Export données RGPD", "get", "/me/data-export", headers=auth(token_admin))

# ============================================================
# LOGIN MENTOR ET INTERN
# ============================================================
print("\n── LOGIN MENTOR ET STAGIAIRE ───────────────────────────")

import subprocess
result = subprocess.run(
    ["php", "artisan", "tinker", "--execute",
     "echo json_encode(App\\Models\\User::where('role','mentor')->first()->only(['id','email']));"],
    capture_output=True, text=True, cwd="F:\\nextmux-projects"
)
if result.stdout:
    try:
        mentor_data = json.loads(result.stdout.strip())
        mentor_email = mentor_data.get("email")
        mentor_id = mentor_data.get("id")
        r = test("Login Mentor", "post", "/auth/login",
            data={"email": mentor_email, "password": "password"})
        if r and r.status_code == 200:
            token_mentor = r.json()["data"]["token"]
            print(f"   → Token mentor obtenu")
    except:
        print("   → Impossible de récupérer le mentor automatiquement")

result2 = subprocess.run(
    ["php", "artisan", "tinker", "--execute",
     "echo json_encode(App\\Models\\User::where('role','intern')->with('internshipAsIntern')->first()->only(['id','email']));"],
    capture_output=True, text=True, cwd="F:\\nextmux-projects"
)
if result2.stdout:
    try:
        intern_data = json.loads(result2.stdout.strip())
        intern_email = intern_data.get("email")
        intern_id = intern_data.get("id")
        r = test("Login Intern", "post", "/auth/login",
            data={"email": intern_email, "password": "password"})
        if r and r.status_code == 200:
            token_intern = r.json()["data"]["token"]
            print(f"   → Token intern obtenu")

        result3 = subprocess.run(
            ["php", "artisan", "tinker", "--execute",
             f"echo json_encode(App\\Models\\Internship::where('intern_id','{intern_id}')->first()?->id);"],
            capture_output=True, text=True, cwd="F:\\nextmux-projects"
        )
        if result3.stdout:
            internship_id = result3.stdout.strip().strip('"')
    except:
        print("   → Impossible de récupérer le stagiaire automatiquement")

# ============================================================
# ADMIN — GESTION UTILISATEURS
# ============================================================
print("\n── ADMIN — UTILISATEURS ────────────────────────────────")

if token_admin:
    r = test("Liste utilisateurs", "get", "/admin/users", headers=auth(token_admin))
    if r and r.status_code == 200:
        users = r.json()["data"]
        if users:
            first_user_id = users[0]["id"] if isinstance(users, list) else None

    test("Détail utilisateur", "get", f"/admin/users/{admin_id}",
        headers=auth(token_admin))

    r = test("Créer mentor", "post", "/admin/users",
        data={"name": "Test Mentor", "email": "testmentor@nextmux.com", "role": "mentor"},
        headers=auth(token_admin))
    new_mentor_id = None
    if r and r.status_code == 201:
        new_mentor_id = r.json()["data"]["id"]

    r = test("Créer stagiaire", "post", "/admin/users",
        data={
            "name": "Test Intern",
            "email": "testintern@nextmux.com",
            "role": "intern",
            "start_date": "2026-01-01",
            "end_date": "2026-12-31",
        },
        headers=auth(token_admin))
    new_intern_id = None
    if r and r.status_code == 201:
        new_intern_id = r.json()["data"]["id"]

    if new_intern_id:
        test("Modifier utilisateur", "patch", f"/admin/users/{new_intern_id}",
            data={"name": "Test Intern Modifié"}, headers=auth(token_admin))

    if new_mentor_id and new_intern_id:
        test("Assigner mentor", "post", f"/admin/users/{new_intern_id}/assign-mentor",
            data={"mentor_id": new_mentor_id}, headers=auth(token_admin))

    if new_intern_id:
        test("Renvoyer invitation", "post", f"/admin/users/{new_intern_id}/resend-invitation",
            headers=auth(token_admin))

# ============================================================
# STATS ADMIN
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

if token_intern:
    r = test("Pointer présence", "post", "/attendance",
        data={"date": datetime.now().strftime("%Y-%m-%d"), "status": "present"},
        headers=auth(token_intern))

    test("Historique présences", "get", "/attendance", headers=auth(token_intern))

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
    test("Liste rapports stagiaire", "get", "/reports", headers=auth(token_intern))

if token_mentor:
    test("Rapports en attente (mentor)", "get", "/reports/pending",
        headers=auth(token_mentor))

# ============================================================
# PROJECTS
# ============================================================
print("\n── PROJECTS ────────────────────────────────────────────")

if token_mentor:
    r = test("Créer projet", "post", "/projects",
        data={
            "title": "Projet Test API",
            "description": "Description du projet test",
            "objectives": "Objectifs du projet",
            "start_date": "2026-01-01",
        },
        headers=auth(token_mentor))
    if r and r.status_code == 201:
        project_id = r.json()["data"]["id"]
        print(f"   → Projet créé : {project_id}")

    test("Liste projets (mentor)", "get", "/projects", headers=auth(token_mentor))

    if project_id:
        test("Détail projet", "get", f"/projects/{project_id}",
            headers=auth(token_mentor))

        test("Modifier projet", "patch", f"/projects/{project_id}",
            data={"title": "Projet Test API Modifié"},
            headers=auth(token_mentor))

        test("Mettre à jour avancement", "patch", f"/projects/{project_id}/progress",
            data={"progress": 50}, headers=auth(token_mentor))

        if intern_id:
            r = test("Assigner stagiaires", "post", f"/projects/{project_id}/assign",
                data={"intern_ids": [intern_id]}, headers=auth(token_mentor))

if token_intern:
    test("Liste projets (stagiaire)", "get", "/projects", headers=auth(token_intern))

# ============================================================
# TASKS
# ============================================================
print("\n── TASKS ───────────────────────────────────────────────")

if token_mentor and project_id:
    r = test("Créer tâche", "post", f"/projects/{project_id}/tasks",
        data={
            "title": "Tâche Test",
            "description": "Description de la tâche test",
        },
        headers=auth(token_mentor))
    if r and r.status_code == 201:
        task_id = r.json()["data"]["id"]
        print(f"   → Tâche créée : {task_id}")

    test("Liste tâches du projet", "get", f"/projects/{project_id}/tasks",
        headers=auth(token_mentor))

    if task_id:
        test("Détail tâche", "get", f"/tasks/{task_id}", headers=auth(token_mentor))

        test("Modifier tâche", "patch", f"/tasks/{task_id}",
            data={"title": "Tâche Test Modifiée"}, headers=auth(token_mentor))

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
        data={"type": "attestation", "request_note": "Pour candidature emploi"},
        headers=auth(token_intern))
    if r and r.status_code == 201:
        document_id = r.json()["data"]["id"]

    test("Mes documents", "get", "/documents", headers=auth(token_intern))

if token_admin:
    test("Documents en attente", "get", "/documents/pending", headers=auth(token_admin))

    if document_id:
        test("Approuver document", "post", f"/documents/{document_id}/approve",
            headers=auth(token_admin))

# ============================================================
# EVENTS
# ============================================================
print("\n── EVENTS ──────────────────────────────────────────────")

if token_admin:
    r = test("Publier événement", "post", "/events",
        data={
            "title": "Réunion d'équipe",
            "content": "Réunion mensuelle de l'équipe NEXTMUX",
            "audience": "all",
            "is_pinned": True,
        },
        headers=auth(token_admin))
    if r and r.status_code == 201:
        event_id = r.json()["data"]["id"]

    test("Liste événements (admin)", "get", "/events", headers=auth(token_admin))

    if event_id:
        test("Détail événement", "get", f"/events/{event_id}", headers=auth(token_admin))

        test("Modifier événement", "patch", f"/events/{event_id}",
            data={"title": "Réunion d'équipe Modifiée"}, headers=auth(token_admin))

if token_intern:
    test("Liste événements (stagiaire)", "get", "/events", headers=auth(token_intern))

# ============================================================
# SÉCURITÉ — ACCÈS NON AUTORISÉS
# ============================================================
print("\n── SÉCURITÉ — ACCÈS SANS TOKEN ─────────────────────────")

test("Me sans token", "get", "/me", attendu=[401])
test("Projets sans token", "get", "/projects", attendu=[401])
test("Admin sans token", "get", "/admin/users", attendu=[401])

print("\n── SÉCURITÉ — MAUVAIS RÔLE ─────────────────────────────")

if token_intern:
    test("Intern accède admin users", "get", "/admin/users",
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
# RÉSUMÉ FINAL
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