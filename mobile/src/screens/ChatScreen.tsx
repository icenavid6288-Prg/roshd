import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { faNum } from '../theme';

type ChatChannelId = 'instructors' | 'course_group' | 'course_support';

interface InstructorItem {
    id: string;
    itemNumber: number;
    itemTitle: string;
    name: string;
    specialty: string;
    responseTime: string;
    online: boolean;
}

interface ChatMessage {
    id: string;
    senderName: string;
    senderRole: 'student' | 'instructor' | 'support' | 'peer';
    text: string;
    timestamp: string;
    channelId: ChatChannelId;
    instructorId?: string;
}

const INSTRUCTORS: InstructorItem[] = [
    {
        id: 'inst-1',
        itemNumber: 1,
        itemTitle: 'خودشناسی و استعداد',
        name: 'دکتر محمد بیدی',
        specialty: 'راهبر دوره',
        responseTime: '۳۰ دقیقه',
        online: true,
    },
    {
        id: 'inst-2',
        itemNumber: 2,
        itemTitle: 'تفکر استراتژیک',
        name: 'استاد سارا رحیمی',
        specialty: 'کوچ برنامه‌ریزی',
        responseTime: '۴۵ دقیقه',
        online: true,
    },
    {
        id: 'inst-3',
        itemNumber: 3,
        itemTitle: 'ارتباط و رهبری',
        name: 'استاد امیرحسین کاظمی',
        specialty: 'مدرس ارتباطات',
        responseTime: '۱ ساعت',
        online: false,
    },
    {
        id: 'inst-4',
        itemNumber: 4,
        itemTitle: 'سواد مالی و پروژه',
        name: 'مهندس نیلوفر صادقی',
        specialty: 'منتور کارآفرینی',
        responseTime: '۱ ساعت',
        online: true,
    },
];

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: 'msg-1',
        senderName: 'دکتر محمد بیدی',
        senderRole: 'instructor',
        text: 'سلام آرین جان! نمودار استعدادیابی تو عالی بود. هر سؤالی درباره آیتم اول داری همین‌جا بپرس.',
        timestamp: '۱۰:۱۵',
        channelId: 'instructors',
        instructorId: 'inst-1',
    },
    {
        id: 'msg-2',
        senderName: 'استاد سارا رحیمی',
        senderRole: 'instructor',
        text: 'جدول هدف‌گذاری ۹۰ روزه‌ات برای هفته سوم عالی تنظیم شده.',
        timestamp: '۱۱:۴۰',
        channelId: 'instructors',
        instructorId: 'inst-2',
    },
    {
        id: 'msg-3',
        senderName: 'استاد امیرحسین کاظمی',
        senderRole: 'instructor',
        text: 'تمرین ارائه ۳ دقیقه‌ای تو در کارگاه قبلی خیلی خوب بود!',
        timestamp: 'دیروز',
        channelId: 'instructors',
        instructorId: 'inst-3',
    },
    {
        id: 'msg-4',
        senderName: 'مهندس نیلوفر صادقی',
        senderRole: 'instructor',
        text: 'ایده بوم کسب‌وکار نوجوان کاملاً قابلیت اجرا در نمایشگاه پایان دوره رو داره.',
        timestamp: 'دیروز',
        channelId: 'instructors',
        instructorId: 'inst-4',
    },
    {
        id: 'msg-5',
        senderName: 'پارسا محمدی',
        senderRole: 'peer',
        text: 'بچه‌ها برای پروژه گروهی سه‌شنبه با هم هماهنگ بشیم.',
        timestamp: '۱۲:۰۵',
        channelId: 'course_group',
    },
    {
        id: 'msg-6',
        senderName: 'پشتیبان دوره',
        senderRole: 'support',
        text: 'لینک وبینار پنجشنبه و جزوه کارگاه در داشبورد فعال شد.',
        timestamp: '۰۹:۲۰',
        channelId: 'course_support',
    },
];

export function ChatScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();
    const [activeChannel, setActiveChannel] = useState<ChatChannelId>('instructors');
    const [selectedInstructorId, setSelectedInstructorId] = useState<string>('inst-1');
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [draft, setDraft] = useState('');

    const visibleMessages = messages.filter((m) => {
        if (m.channelId !== activeChannel) return false;
        if (activeChannel === 'instructors') {
            return m.instructorId === selectedInstructorId;
        }
        return true;
    });

    const activeInstructor =
        INSTRUCTORS.find((inst) => inst.id === selectedInstructorId) || INSTRUCTORS[0];

    const handleSend = () => {
        const trimmed = draft.trim();
        if (!trimmed) return;
        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderName: user?.name || 'آرین مرادی',
            senderRole: 'student',
            text: trimmed,
            timestamp: 'هم‌اکنون',
            channelId: activeChannel,
            instructorId: activeChannel === 'instructors' ? selectedInstructorId : undefined,
        };
        setMessages((prev) => [...prev, newMsg]);
        setDraft('');
    };

    return (
        <Screen>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.page}>
                {/* Visual Channel Selector Card */}
                <View style={[s.headerCard, { backgroundColor: '#123E30' }]}>
                    <View style={s.headerTop}>
                        <Ionicons name="chatbubbles" size={20} color="#D6F39A" />
                        <Text style={s.headerTitle}>گفتگوی دوره VIP</Text>
                    </View>

                    <View style={s.channelTabs}>
                        {[
                            { id: 'instructors' as const, label: 'اساتید', icon: 'school-outline' as const },
                            { id: 'course_group' as const, label: 'گروه', icon: 'people-outline' as const },
                            { id: 'course_support' as const, label: 'پشتیبانی', icon: 'headset-outline' as const },
                        ].map((ch) => {
                            const active = activeChannel === ch.id;
                            return (
                                <Pressable
                                    key={ch.id}
                                    onPress={() => setActiveChannel(ch.id)}
                                    style={[
                                        s.channelTab,
                                        active && { backgroundColor: '#D6F39A' },
                                    ]}
                                >
                                    <Ionicons
                                        name={ch.icon}
                                        size={15}
                                        color={active ? '#123E30' : '#D9E6DF'}
                                    />
                                    <Text
                                        style={[
                                            s.channelTabText,
                                            { color: active ? '#123E30' : '#D9E6DF' },
                                        ]}
                                    >
                                        {ch.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {activeChannel === 'instructors' && (
                    <View style={s.instructorGrid}>
                        {INSTRUCTORS.map((inst) => {
                            const selected = inst.id === selectedInstructorId;
                            return (
                                <Pressable
                                    key={inst.id}
                                    onPress={() => setSelectedInstructorId(inst.id)}
                                    style={[
                                        s.instructorCard,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: selected ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <View style={s.instRow}>
                                        <View style={s.instBadge}>
                                            <Ionicons name="ribbon-outline" size={11} color="#123E30" />
                                            <Text style={s.instBadgeText}>
                                                {faNum(inst.itemNumber)}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                s.onlineDot,
                                                {
                                                    backgroundColor: inst.online
                                                        ? '#10B981'
                                                        : '#9CA3AF',
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={[s.instName, { color: colors.text }]} numberOfLines={1}>
                                        {inst.name}
                                    </Text>
                                    <Text
                                        style={[s.instTitle, { color: colors.primary }]}
                                        numberOfLines={1}
                                    >
                                        {inst.itemTitle}
                                    </Text>
                                    <View style={s.instMetaRow}>
                                        <Ionicons name="time-outline" size={11} color={colors.muted} />
                                        <Text
                                            style={[s.instMeta, { color: colors.muted }]}
                                            numberOfLines={1}
                                        >
                                            {inst.responseTime}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                )}

                <View
                    style={[
                        s.chatBox,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <View style={[s.chatBoxHeader, { borderBottomColor: colors.border }]}>
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
                        <Text style={[s.chatBoxTitle, { color: colors.text }]} numberOfLines={1}>
                            {activeChannel === 'instructors'
                                ? activeInstructor.name
                                : activeChannel === 'course_group'
                                  ? 'گروه دانش‌پذیران'
                                  : 'پشتیبانی دوره'}
                        </Text>
                    </View>

                    <View style={s.messageList}>
                        {visibleMessages.map((msg) => {
                            const isMe = msg.senderRole === 'student';
                            return (
                                <View
                                    key={msg.id}
                                    style={[
                                        s.messageBubble,
                                        isMe
                                            ? {
                                                  backgroundColor: '#123E30',
                                                  alignSelf: 'flex-start',
                                              }
                                            : {
                                                  backgroundColor: colors.surfaceAlt,
                                                  alignSelf: 'flex-end',
                                              },
                                    ]}
                                >
                                    <View style={s.msgHeader}>
                                        <Text
                                            style={[
                                                s.msgSender,
                                                { color: isMe ? '#D6F39A' : colors.primary },
                                            ]}
                                        >
                                            {msg.senderName}
                                        </Text>
                                        <Text
                                            style={[
                                                s.msgTime,
                                                { color: isMe ? '#C5D7CA' : colors.muted },
                                            ]}
                                        >
                                            {msg.timestamp}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            s.msgText,
                                            { color: isMe ? '#FFFFFF' : colors.text },
                                        ]}
                                    >
                                        {msg.text}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={[s.inputRow, { borderTopColor: colors.border }]}>
                        <TextInput
                            value={draft}
                            onChangeText={setDraft}
                            placeholder="پیام…"
                            placeholderTextColor={colors.muted}
                            style={[
                                s.input,
                                {
                                    backgroundColor: colors.surfaceAlt,
                                    color: colors.text,
                                    borderColor: colors.border,
                                },
                            ]}
                        />
                        <Pressable onPress={handleSend} style={s.sendBtn}>
                            <Ionicons name="send" size={16} color="#123E30" />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}

const s = StyleSheet.create({
    page: { padding: 16, paddingBottom: 32, gap: 14 },
    headerCard: { borderRadius: 22, padding: 14, gap: 10 },
    headerTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
    headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    channelTabs: {
        flexDirection: 'row-reverse',
        gap: 6,
        backgroundColor: '#0B281F',
        padding: 4,
        borderRadius: 14,
    },
    channelTab: {
        flex: 1,
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    channelTabText: { fontSize: 12, fontWeight: '800' },
    instructorGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
    instructorCard: {
        width: '48%',
        borderWidth: 1.5,
        borderRadius: 16,
        padding: 10,
        gap: 4,
    },
    instRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
    instBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#E6F4EA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    instBadgeText: { color: '#123E30', fontSize: 10, fontWeight: '800' },
    onlineDot: { width: 8, height: 8, borderRadius: 4 },
    instName: { fontSize: 13, fontWeight: '800', textAlign: 'right' },
    instTitle: { fontSize: 11, fontWeight: '700', textAlign: 'right' },
    instMetaRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
    instMeta: { fontSize: 10 },
    chatBox: { borderWidth: 1, borderRadius: 20, overflow: 'hidden' },
    chatBoxHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderBottomWidth: 1,
    },
    chatBoxTitle: { fontSize: 13, fontWeight: '800', flex: 1, textAlign: 'right' },
    messageList: { padding: 12, gap: 10 },
    messageBubble: { maxWidth: '88%', borderRadius: 16, padding: 12, gap: 4 },
    msgHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', gap: 12 },
    msgSender: { fontSize: 11, fontWeight: '800' },
    msgTime: { fontSize: 10 },
    msgText: { fontSize: 12, lineHeight: 20, textAlign: 'right' },
    inputRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 12,
        textAlign: 'right',
    },
    sendBtn: {
        width: 42,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D6F39A',
        borderRadius: 12,
    },
});
