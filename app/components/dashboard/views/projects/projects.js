'use client';

import { useState, useEffect } from 'react';
import styles from './projects.module.scss';

export default function ProjectsView({ user, onOpenProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (openMenuId === null) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-menu-root]')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  async function loadProjects() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to load projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError('Could not load projects');
    } finally {
      setLoading(false);
    }
  }

  function handleCreated(newProject) {
    setProjects((prev) => [newProject, ...prev]);
    setShowCreate(false);
  }

  function handleMenuToggle(e, id) {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId((current) => (current === id ? null : id));
  }

  function handleShare(project) {
    setOpenMenuId(null);
    setShareTarget(project);
  }

  function handleDelete(project) {
    setOpenMenuId(null);
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    alert('Delete not implemented yet — coming in the next batch.');
  }

  function handleMembersUpdate(projectId, updatedMembers) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, members: updatedMembers, memberCount: updatedMembers.length + 1 }
          : p
      )
    );
    if (shareTarget?.id === projectId) {
      setShareTarget((prev) => ({ ...prev, members: updatedMembers }));
    }
  }

  return (
    <div className={styles.projects}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Projects</h2>
          {!loading && projects.length > 0 && (
            <span className={styles.count}>{projects.length}</span>
          )}
        </div>
        <button
          className={styles.createBtn}
          onClick={() => setShowCreate(true)}
        >
          + New Project
        </button>
      </div>

      {loading && <div className={styles.state}>Loading projects...</div>}

      {!loading && error && <div className={styles.stateError}>{error}</div>}

      {!loading && !error && projects.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>{'</>'}</div>
          <h3>No projects yet</h3>
          <p>Create your first project to start collaborating.</p>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreate(true)}
          >
            Create Project
          </button>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}>{'</>'}</div>
                <div className={styles.cardHeaderRight} data-menu-root>
                  {project.isOwner && <span className={styles.badge}>Owner</span>}
                  <button
                    className={styles.menuBtn}
                    onClick={(e) => handleMenuToggle(e, project.id)}
                    aria-label="Project options"
                  >
                    ⋯
                  </button>
                  {openMenuId === project.id && (
                    <div className={styles.menu}>
                      {(project.isOwner || project.myRole === 'admin') && (
                        <button
                          className={styles.menuItem}
                          onClick={() => handleShare(project)}
                        >
                          Share with team
                        </button>
                      )}
                      <button
                        className={styles.menuItem}
                        onClick={() => onOpenProject(project.id)}
                      >
                        Open project
                      </button>
                      {project.isOwner && (
                        <button
                          className={`${styles.menuItem} ${styles.menuDanger}`}
                          onClick={() => handleDelete(project)}
                        >
                          Delete project
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3>{project.name}</h3>
                {project.description && <p>{project.description}</p>}
                <div className={styles.meta}>
                  <span>👥 {project.memberCount} member{project.memberCount !== 1 ? 's' : ''}</span>
                  <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.openBtn}
                  onClick={() => onOpenProject(project.id)}
                >
                  Open Project →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {shareTarget && (
        <ShareModal
          project={shareTarget}
          onClose={() => setShareTarget(null)}
          onMembersUpdate={handleMembersUpdate}
        />
      )}
    </div>
  );
}

// ---------- Create Modal ----------
function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create project');
        setSaving(false);
        return;
      }
      onCreated(data);
    } catch (err) {
      setError('Something went wrong');
      setSaving(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <h3 className={styles.modalTitle}>Create New Project</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marketing Site"
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description"
              rows={3}
            />
          </div>

          {error && <span className={styles.errorMsg}>{error}</span>}

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Share Modal ----------
function ShareModal({ project, onClose, onMembersUpdate }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/members`);
      if (res.ok) {
        setMembers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    setError('');
    setInviting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to invite');
        setInviting(false);
        return;
      }
      const updated = [...members, data];
      setMembers(updated);
      onMembersUpdate(project.id, updated);
      setEmail('');
      setRole('editor');
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setInviting(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    const res = await fetch(`/api/projects/${project.id}/members/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      const updated = members.map((m) =>
        m.userId === userId ? { ...m, role: newRole } : m
      );
      setMembers(updated);
      onMembersUpdate(project.id, updated);
    }
  }

  async function handleRemove(userId) {
    if (!confirm('Remove this member?')) return;
    const res = await fetch(`/api/projects/${project.id}/members/${userId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const updated = members.filter((m) => m.userId !== userId);
      setMembers(updated);
      onMembersUpdate(project.id, updated);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <h3 className={styles.modalTitle}>Share &ldquo;{project.name}&rdquo;</h3>

        <form onSubmit={handleInvite} className={styles.inviteForm}>
          <div className={styles.inviteRow}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
              required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={inviting}>
              {inviting ? 'Inviting...' : 'Invite'}
            </button>
          </div>
          {error && <span className={styles.errorMsg}>{error}</span>}
        </form>

        <div className={styles.memberSection}>
          <div className={styles.sectionLabel}>
            Members ({members.length})
          </div>
          {loading && <div className={styles.smallState}>Loading...</div>}
          {!loading && members.length === 0 && (
            <div className={styles.smallState}>No members yet.</div>
          )}
          {!loading &&
            members.map((m) => (
              <div key={m.userId} className={styles.memberRow}>
                <div className={styles.memberAvatar}>
                  {(m.name || m.email || '?').charAt(0).toUpperCase()}
                </div>
                <div className={styles.memberInfo}>
                  <div className={styles.memberName}>{m.name || 'Unnamed'}</div>
                  <div className={styles.memberEmail}>{m.email}</div>
                </div>
                <select
                  className={styles.roleSelect}
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.userId, e.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(m.userId)}
                  title="Remove member"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}