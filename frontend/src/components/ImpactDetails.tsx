import React from 'react';
import { FileCode, Eye, EyeOff } from 'lucide-react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import '../components/ImpactAlert.css'; // Reuse existing styles

interface ImpactDetailsProps {
    impact: {
        changedFile: string;
        affectedFiles: Array<{
            repoId: string;
            filePath: string;
            reason: string;
            context?: string;
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

            {impact.affectedFiles && impact.affectedFiles.length > 0 && (
                <div className="impact-affected-files">
                    <strong>Affected Files ({impact.affectedFiles.length}):</strong>
                    <ul>
                        {impact.affectedFiles.slice(0, 10).map((file, index) => (
                            <li key={index}>
                                <div className="impact-file-info">
                                    <FileCode size={14} />
                                    <span>{file.filePath.split('/').pop()}</span>
                                    <span className="file-reason">{file.reason}</span>
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
                        {impact.affectedFiles.length > 10 && (
                            <li className="more-files">
                                +{impact.affectedFiles.length - 10} more files
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ImpactDetails;
