import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Check, Download, Clock, Lock } from 'lucide-react';

export function AdminDashboard({ onClose }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Resume Dashboard State
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogin = async (e) => {
        e.preventDefault();
        // Mock Login
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid credentials (try admin/admin)');
        }
    };

    const loadOrders = async () => {
        setLoading(true);
        // Mock Orders
        setTimeout(() => {
            setOrders([
                { id: 1, customId: 'ORD-001', name: 'Mock User', upiTxnId: '123456', email: 'mock@example.com', amount: 49, createdAt: new Date().toISOString(), status: 'pending' },
                { id: 2, customId: 'ORD-002', name: 'Test User', upiTxnId: '654321', email: 'test@example.com', amount: 49, createdAt: new Date().toISOString(), status: 'approved' }
            ]);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadOrders();
            // No polling needed for mock
        }
    }, [isAuthenticated]);

    const handleRefresh = () => {
        loadOrders();
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900/90 flex items-center justify-center p-4">
                <Card className="w-full max-w-sm p-8 bg-white shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                        <p className="text-sm text-gray-500 mt-2">Please enter your credentials</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Input
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <Button type="submit" variant="primary" className="w-full">
                            Login
                        </Button>
                        <Button type="button" onClick={onClose} variant="ghost" className="w-full">
                            Cancel
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-gray-100 overflow-auto">
            <div className="max-w-5xl mx-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <Button onClick={handleRefresh} variant="ghost" size="sm" className="bg-white border"><Clock className="w-4 h-4 mr-1" /> Refresh</Button>
                    </div>
                    <Button onClick={onClose} variant="outline">Exit to Editor</Button>
                </div>

                <div className="grid gap-6">
                    {loading && orders.length === 0 ? (
                        <div className="text-center py-10">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <Card className="p-8 text-center text-gray-500">
                            No orders received yet.
                        </Card>
                    ) : (
                        orders.map((order) => (
                            <OrderCard key={order.id} order={order} onUpdate={loadOrders} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function OrderCard({ order, onUpdate }) {
    const [status, setStatus] = useState(order.status);
    const [approving, setApproving] = useState(false);

    const handleApprove = async () => {
        setApproving(true);
        // Mock Approve
        setTimeout(() => {
            setStatus('approved');
            alert(`Order ${order.customId} Approved (Mock)!`);
            setApproving(false);
            onUpdate(); // In a real mock, we'd update state upstream, but this is enough for visual check
        }, 500);
    };

    return (
        <Card className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-gray-500 text-sm">{order.customId}</span>
                    {status === 'approved' ? (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase flex items-center gap-1">
                            <Check className="w-3 h-3" /> Approved
                        </span>
                    ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold uppercase flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending
                        </span>
                    )}
                </div>
                <h3 className="font-bold text-lg">{order.name}</h3>
                <p className="text-sm text-gray-600">UPI: <span className="font-mono">{order.upiTxnId}</span></p>
                <p className="text-sm text-gray-600">Email: {order.email}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                    <span className="block text-2xl font-bold text-gray-900">₹{order.amount}</span>
                    <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                {status !== 'approved' && (
                    <Button onClick={handleApprove} disabled={approving} variant="primary" size="sm" className="bg-green-600 hover:bg-green-700">
                        {approving ? 'Approving...' : 'Approve Payment'}
                    </Button>
                )}
            </div>
        </Card>
    );
}
