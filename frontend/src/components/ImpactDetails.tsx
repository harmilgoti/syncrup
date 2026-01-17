import React, { useState } from 'react';
import { FileCode, Eye, EyeOff, Check, X } from 'lucide-react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import axios from 'axios';
import '../components/ImpactAlert.css'; // Reuse existing styles

const API_URL = 'http://localhost:3001';

interface ImpactDetailsProps {
    impact: {
        changedFile: string;
        affectedFiles: Array<{
            id?: string;
            repoId: string;
            filePath: string;
            reason: string;
            context?: string;
            status?: string;
        }>;
        diff?: {
            oldContent: string;
            newContent: string;
        };
        explanation: string;
    };
}

const ImpactDetails: React.FC<ImpactDetailsProps> = ({ impact }) => {
    const [showDiff, setShowDiff] = React.useState(false);
    const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

    const handleAction = async (id: string | undefined, status: 'RESOLVED' | 'REJECTED') => {
        if (!id) return;

        // Optimistic UI update: Hide immediately
        setHiddenIds(prev => new Set(prev).add(id));

        try {
            await axios.patch(`${API_URL}/impacts/file/${id}/status`, { status });
        } catch (error) {
            console.error('Failed to update status:', error);
            // Revert if failed (optional, but good practice)
            setHiddenIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    // Filter out hidden (resolved/rejected) files
    const visibleFiles = (impact.affectedFiles || []).filter(f => {
        if (f.id && hiddenIds.has(f.id)) return false;
        if (f.status && f.status !== 'PENDING') return false;
        return true;
    });

    return (
        <div className="impact-details-container">
            <div className="impact-changed-file">
                <FileCode size={16} />
                <span>
                    <strong>Changed:</strong> {impact.changedFile ? impact.changedFile.split('/').pop() : 'Unknown File'}
                </span>
                {impact.diff && (
                    <button
                        className="impact-diff-toggle"
                        onClick={() => setShowDiff(!showDiff)}
                    >
                        {showDiff ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showDiff ? 'Hide Diff' : 'View Diff'}
                    </button>
                )}
            </div>

            {showDiff && impact.diff && (
                <div className="impact-diff-viewer" style={{ maxHeight: '400px', overflow: 'auto', margin: '10px 0', border: '1px solid #eee', borderRadius: '4px' }}>
                    <ReactDiffViewer
                        oldValue={impact.diff.oldContent}
                        newValue={impact.diff.newContent}
                        splitView={true}
                        compareMethod={DiffMethod.WORDS}
                        styles={{
                            variables: {
                                dark: {
                                    diffViewerBackground: '#fff',
                                }
                            }
                        }}
                    />
                </div>
            )}

            <p className="impact-explanation" style={{ marginTop: '10px', marginBottom: '10px' }}>{impact.explanation}</p>

            {visibleFiles.length > 0 ? (
                <div className="impact-affected-files">
                    <strong>Affected Files ({visibleFiles.length}):</strong>
                    <ul>
                        {visibleFiles.map((file, index) => (
                            <li key={index} className="group relative">
                                <div className="flex justify-between items-start">
                                    <div className="impact-file-info flex-1">
                                        <FileCode size={14} />
                                        <span>{file.filePath.split('/').pop()}</span>
                                        <span className="file-reason">{file.reason}</span>
                                    </div>
                                    {file.id && (
                                        <div className="flex gap-2 ml-4 shrink-0">
                                            <button
                                                onClick={() => handleAction(file.id, 'RESOLVED')}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-sm font-medium text-xs whitespace-nowrap"
                                                title="Accept Impact (Mark as Resolved)"
                                            >
                                                <Check size={14} />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleAction(file.id, 'REJECTED')}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all shadow-sm font-medium text-xs whitespace-nowrap"
                                                title="Reject Impact (Ignore)"
                                            >
                                                <X size={14} />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {file.context && (
                                    <pre className="file-context" style={{
                                        display: 'block',
                                        width: '100%',
                                        background: '#f8f9fa',
                                        padding: '8px',
                                        fontSize: '11px',
                                        marginTop: '4px',
                                        borderRadius: '4px',
                                        overflowX: 'auto',
                                        fontFamily: 'monospace'
                                    }}>
                                        {file.context}
                                    </pre>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-gray-500 italic text-sm mt-2">
                    All affected files resolved or rejected.
                </div>
            )}
        </div>
    );
};

export default ImpactDetails;
