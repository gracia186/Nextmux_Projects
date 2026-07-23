import { useEffect, useRef, useState } from 'react';
import { Upload, FileUp, Trash2, File, FileSignature, Download, AlertCircle } from 'lucide-react';
import { stagiaireApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { DocumentStagiaire, DemandeDocument } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

const API_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/api\/?$/, '');

const STATUT_TONE = { en_attente: 'warning', validee: 'info', rejetee: 'danger', delivree: 'success' } as const;
const STATUT_LABELS = { en_attente: 'En attente', validee: 'Validée (en attente du fichier)', rejetee: 'Rejetée', delivree: 'Livrée' };
const TYPE_LABELS = { convention: 'Convention de stage', attestation: 'Attestation de stage' };

function formatSize(bytes?: number | null) {
  if (!bytes) return '';
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} Mo` : `${Math.round(kb)} Ko`;
}

export default function StagiaireDocuments() {
  useDashboardHeader('Documents', 'Convention, attestations et pièces jointes de stage');
  const [documents, setDocuments] = useState<DocumentStagiaire[] | null>(null);
  const [demandes, setDemandes] = useState<DemandeDocument[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [demandeLoading, setDemandeLoading] = useState<string | null>(null);
  const [demandeError, setDemandeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function load() {
    stagiaireApi.documents().then((res) => setDocuments(res.data));
    stagiaireApi.demandesDocuments().then((res) => setDemandes(res.data));
  }

  useEffect(load, []);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      await stagiaireApi.uploadDocument(file);
      load();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    await stagiaireApi.deleteDocument(id);
    load();
  }

  async function demander(type: 'convention' | 'attestation') {
    setDemandeLoading(type);
    setDemandeError(null);
    try {
      await stagiaireApi.createDemandeDocument(type);
      load();
    } catch (err) {
      setDemandeError(apiErrorMessage(err, 'Impossible de créer cette demande.'));
    } finally {
      setDemandeLoading(null);
    }
  }

  const dejaEnCours = (type: string) => demandes?.some((d) => d.type === type && ['en_attente', 'validee'].includes(d.statut));

  return (
    <div>
      <Card className="card" index={0} style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileSignature size={16} /> Demandes de documents administratifs
        </h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>
          Votre mentor valide la demande, puis l'administration vous délivre le document.
        </p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {(['convention', 'attestation'] as const).map((type) => (
            <Button
              key={type}
              size="sm"
              variant="ghost"
              loading={demandeLoading === type}
              disabled={dejaEnCours(type)}
              onClick={() => demander(type)}
            >
              Demander une {TYPE_LABELS[type].toLowerCase()}
            </Button>
          ))}
        </div>
        {demandeError && (
          <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={13} /> {demandeError}
          </p>
        )}

        {demandes === null ? (
          <Skeleton height={40} />
        ) : demandes.length === 0 ? (
          <p className="page-subtitle">Aucune demande pour le moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {demandes.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{TYPE_LABELS[d.type]}</div>
                  {d.commentaire_mentor && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{d.commentaire_mentor}</div>}
                </div>
                <Badge tone={STATUT_TONE[d.statut]}>{STATUT_LABELS[d.statut]}</Badge>
                {d.statut === 'delivree' && d.fichier && (
                  <a href={`${API_ORIGIN}/storage/${d.fichier}`} target="_blank" rel="noreferrer" className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Télécharger">
                    <Download size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="page-header">
        <p className="page-subtitle">{documents?.length ?? 0} document(s) personnels</p>
        <Button icon={<Upload size={15} />} loading={uploading} onClick={() => inputRef.current?.click()}>
          Téléverser un document
        </Button>
        <input
          ref={inputRef}
          type="file"
          hidden
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      <Card className="card" index={1}>
        {documents === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={44} />)}</div>
        ) : documents.length === 0 ? (
          <EmptyState icon={<FileUp size={40} />} title="Aucun document" description="Téléversez votre CV ou d'autres pièces jointes." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {documents.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', borderTop: '1px solid var(--glass-border)' }}>
                <File size={18} color="var(--primary-light)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5 }}>{d.nom}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{d.type ?? 'fichier'} · {formatSize(d.taille)}</div>
                </div>
                <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => handleDelete(d.id)} aria-label="Supprimer">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
