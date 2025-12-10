import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
                    <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg max-w-2xl w-full">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Algo salió mal... 😔</h1>
                        <p className="mb-4 text-gray-300">La aplicación ha encontrado un error crítico.</p>
                        <div className="bg-black/50 p-4 rounded text-sm font-mono overflow-auto mb-4 border border-white/10">
                            {this.state.error && this.state.error.toString()}
                        </div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-colors"
                        >
                            Recargar Aplicación
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
