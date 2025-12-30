import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { X, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { API_URL } from '../../services/api';
import toast from 'react-hot-toast';
import axios from 'axios';

export function PaymentModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState('plans'); // 'plans' | 'payment' | 'success'
    const [selectedPlan, setSelectedPlan] = useState('yearly');
    const [couponCode, setCouponCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const plans = {
        monthly: { name: '1 Month', price: 90, duration: '30 Days' },
        quarterly: { name: '3 Months', price: 299, duration: '90 Days' },
        yearly: { name: '1 Year', price: 365, duration: '365 Days' }
    };

    const isOfferActive = couponCode.trim().toUpperCase() === 'RGNEW2026';
    const currentPrice = isOfferActive ? 0 : plans[selectedPlan].price;

    if (!isOpen) return null;

    const handleSubscribe = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.userId && !user._id) {
            toast.error("Please login to subscribe");
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/users/subscribe`, {
                userId: user._id || user.userId,
                plan: selectedPlan,
                coupon: couponCode.trim().toUpperCase()
            });

            // Update local storage user data
            const updatedUser = { ...user, ...res.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success(res.data.message);
            setStep('success');
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || "Subscription failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <Card className="w-full max-w-lg bg-white shadow-2xl relative overflow-hidden rounded-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {step !== 'success' && (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade to Pro</h2>
                            <p className="text-gray-600">Download unlimited resumes and unlock AI features.</p>
                        </div>

                        {/* Plan Selection */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {Object.entries(plans).map(([key, plan]) => (
                                <div
                                    key={key}
                                    onClick={() => setSelectedPlan(key)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedPlan === key
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-200'
                                        }`}
                                >
                                    <p className={`text-xs font-bold uppercase ${selectedPlan === key ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {plan.name}
                                    </p>
                                    <p className="text-xl font-bold mt-1">₹{plan.price}</p>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Section */}
                        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Have a Coupon Code?</label>
                            <div className="flex gap-2">
                                <Input
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value)}
                                    placeholder="Enter Coupon Code"
                                    className="bg-white border-slate-200 uppercase"
                                />
                            </div>
                            {isOfferActive && (
                                <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Offer Applied: RGNEW2026 (Free Access)
                                </p>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-2xl">
                            <div>
                                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Amount</p>
                                <p className="text-3xl font-bold">
                                    {isOfferActive ? (
                                        <span className="flex items-center gap-2">
                                            <span className="line-through text-gray-500 text-xl">₹{plans[selectedPlan].price}</span>
                                            ₹0
                                        </span>
                                    ) : `₹${plans[selectedPlan].price}`}
                                </p>
                            </div>
                            <Button
                                onClick={handleSubscribe}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold h-auto"
                            >
                                {isLoading ? "Processing..." : isOfferActive ? "Apply Offer" : "Upgrade Now"}
                            </Button>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            Secure Encrypted Payment
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">You're Pro!</h2>
                        <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                            Your subscription is now active. You can download unlimited resumes.
                        </p>
                        <Button
                            onClick={onClose}
                            className="w-full bg-gray-900 text-white rounded-xl py-4 h-auto font-bold"
                        >
                            Start Building
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
