import React from 'react';
import { AlertTriangle, X, FileCode, AlertCircle } from 'lucide-react';
import './ImpactAlert.css';

interface ImpactAlertProps {
    impact: {
        projectId: string;
        changedFile: string;
        changedRepo: string;
        affectedFiles: Array<{
            repoId: string;
            filePath: string;
            reason: string;
        }>;
        isBreaking: boolean;
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        explanation: string;
        timestamp: string;
    };
    onDismiss: () => void;
}

const ImpactAlert: React.FC<ImpactAlertProps> = ({ impact, onDismiss }) => {
    const getSeverityColor = () => {
        switch (impact.severity) {
            case 'CRITICAL': return '#ef4444';
            case 'HIGH': return '#f59e0b';
            case 'MEDIUM': return '#eab308';
            case 'LOW': return '#10b981';
            default: return '#6366f1';
        }
    };

    const getSeverityIcon = () => {
        if (impact.isBreaking) {
            return <AlertTriangle size={24} color={getSeverityColor()} />;
        }
        return <AlertCircle size={24} color={getSeverityColor()} />;
    };

    return (
        <div className="impact-alert" style={{ borderLeftColor: getSeverityColor() }}>
            <div className="impact-alert-header">
                <div className="impact-alert-title">
                    {getSeverityIcon()}
                    <div>
                        <h4>
                            {impact.isBreaking ? '⚠️ Breaking Change Detected' : '📢 Impact Detected'}
                        </h4>
                        <span className="impact-severity" style={{ color: getSeverityColor() }}>
                            {impact.severity}
                        </span>
                    </div>
                </div>
                <button onClick={onDismiss} className="impact-alert-close">
                    <X size={20} />
                </button>
            </div>

            <div className="impact-alert-body">
                <div className="impact-changed-file">
                    <FileCode size={16} />
                    <span>
                        <strong>Changed:</strong> {impact.changedFile.split('/').pop()}
                    </span>
                </div>

                <p className="impact-explanation">{impact.explanation}</p>

                {impact.affectedFiles.length > 0 && (
                    <div className="impact-affected-files">
                        <strong>Affected Files ({impact.affectedFiles.length}):</strong>
                        <ul>
                            {impact.affectedFiles.slice(0, 5).map((file, index) => (
                                <li key={index}>
                                    <FileCode size={14} />
                                    <span>{file.filePath.split('/').pop()}</span>
                                    <span className="file-reason">{file.reason}</span>
                                </li>
                            ))}
                            {impact.affectedFiles.length > 5 && (
                                <li className="more-files">
                                    +{impact.affectedFiles.length - 5} more files
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            <div className="impact-alert-footer">
                <span className="impact-timestamp">
                    {new Date(impact.timestamp).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

export default ImpactAlert;
