import { Head, router } from '@inertiajs/react';
import { UserAuthModal } from '@/Components/UserAuthModal';
import { useDynamicAppStore } from '@/lib/dynamicAppStore';

export default function Register() {
    const { appState, updateAppState } = useDynamicAppStore();

    return (
        <>
            <Head title="ورود یا ثبت‌نام · سوپراپ جامع رشد" />
            <UserAuthModal
                isOpen={true}
                onClose={() => {}}
                userProfile={{
                    ...appState.userProfile,
                    isAuthenticated: false,
                }}
                onUpdateProfile={(updated) => {
                    updateAppState((prev) => ({
                        ...prev,
                        userProfile: {
                            ...prev.userProfile,
                            ...updated,
                            isAuthenticated: true,
                        },
                    }));
                    router.visit('/');
                }}
                onLogout={() => {}}
                isIndependent={true}
            />
        </>
    );
}
