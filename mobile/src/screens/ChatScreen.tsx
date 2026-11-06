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
        itemTitle: 'آیتم ۱: خودشناسی و کشف استعداد',
        name: 'دکتر محمد بیدی',
        specialty: 'روان‌شناس و راهبر اصلی دوره طراحی آینده',
        responseTime: 'پاسخگویی زیر ۳۰ دقیقه',
        online: true,
    },
    {
        id: 'inst-2',
        itemNumber: 2,
        itemTitle: 'آیتم ۲: تفکر استراتژیک و هدف‌گذاری ۹۰ روزه',
        name: 'استاد سارا رحیمی',
        specialty: 'کوچ برنامه‌ریزی و مدیریت زمان نوجوان',
        responseTime: 'پاسخگویی زیر ۴۵ دقیقه',
        online: true,
    },
    {
        id: 'inst-3',
        itemNumber: 3,
        itemTitle: 'آیتم ۳: ارتباط مؤثر، فن بیان و رهبری تیمی',
        name: 'استاد امیرحسین کاظمی',
        specialty: 'مدرس ارتباطات، مذاکره و کار تیمی',
        responseTime: 'پاسخگویی زیر ۱ ساعت',
        online: false,
    },
    {
        id: 'inst-4',
        itemNumber: 4,
        itemTitle: 'آیتم ۴: سواد مالی، کارآفرینی و پروژه نهایی',
        name: 'مهندس نیلوفر صادقی',
        specialty: 'منتور کارآفرینی نوجوان و هوش مالی',
        responseTime: 'پاسخگویی زیر ۱ ساعت',
        online: true,
    },
];

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: 'msg-1',
        senderName: 'دکتر محمد بیدی',
        senderRole: 'instructor',
        text: 'سلام آرین جان! نمودار استعدادیابی هالند و کلیفتون تو رو بررسی کردم. در بخش تفکر تحلیلی رشد فوق‌العاده‌ای داشتی. هر سؤالی درباره آیتم اول داری همین‌جا بپرس.',
        timestamp: '۱۰:۱۵',
        channelId: 'instructors',
        instructorId: 'inst-1',
    },
    {
        id: 'msg-2',
        senderName: 'استاد سارا رحیمی',
        senderRole: 'instructor',
        text: 'آرین عزیز، جدول هدف‌گذاری ۹۰ روزه‌ات برای هفته سوم عالی تنظیم شده. فقط اولویت دوم رو کمی دقیق‌تر بنویس.',
        timestamp: '۱۱:۴۰',
        channelId: 'instructors',
        instructorId: 'inst-2',
    },
    {
        id: 'msg-3',
        senderName: 'استاد امیرحسین کاظمی',
        senderRole: 'instructor',
        text: 'تمرین ارائه ۳ دقیقه‌ای تو در کارگاه قبلی خیلی خوب بود! روی زبان بدن در شروع صحبت بیشتر تمرکز کن.',
        timestamp: 'دیروز',
        channelId: 'instructors',
        instructorId: 'inst-3',
    },
    {
        id: 'msg-4',
        senderName: 'مهندس نیلوفر صادقی',
        senderRole: 'instructor',
        text: 'ایده بوم کسب‌وکار نوجوان که طراحی کردی کاملاً قابلیت اجرا در نمایشگاه پایان دوره رو داره.',
        timestamp: 'دیروز',
        channelId: 'instructors',
        instructorId: 'inst-4',
    },
    {
        id: 'msg-5',
        senderName: 'پارسا محمدی (هم‌دوره‌ای)',
        senderRole: 'peer',
        text: 'بچه‌ها کسی فایل کاربرگ بوم مدل کسب‌وکار آیتم ۴ رو پر کرده؟ می‌تونیم برای پروژه گروهی سه‌شنبه با هم هماهنگ بشیم.',
        timestamp: '۱۲:۰۵',
        channelId: 'course_group',
    },
    {
        id: 'msg-6',
        senderName: 'پشتیبان دوره (خانم مرادی)',
        senderRole: 'support',
        text: 'سلام! لینک ورود به وبینار زنده پنجشنبه و جزوه کارگاه حضوری سه‌شنبه در داشبورد شما فعال شد.',
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
                <View style={[s.headerCard, { backgroundColor: '#123E30' }]}>
                    <Text style={s.headerTitle}>مرکز گفتگوی دوره طراحی آینده نوجوان</Text>
                    <Text style={s.headerSub}>
                        ارتباط مستقیم با ۴ مدرس تخصصی آیتم‌های دوره، گروه هم‌دوره‌ای‌ها و پشتیبان
                    </Text>

                    <View style={s.channelTabs}>
                        {[
                            { id: 'instructors' as const, label: 'مدرسان (۴ آیتم)' },
                            { id: 'course_group' as const, label: 'گروه دوره' },
                            { id: 'course_support' as const, label: 'پشتیبانی دوره' },
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
                                            <Text style={s.instBadgeText}>
                                                آیتم {faNum(inst.itemNumber)}
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
                                    <Text style={[s.instName, { color: colors.text }]}>
                                        {inst.name}
                                    </Text>
                                    <Text
                                        style={[s.instTitle, { color: colors.primary }]}
                                        numberOfLines={1}
                                    >
                                        {inst.itemTitle}
                                    </Text>
                                    <Text
                                        style={[s.instMeta, { color: colors.muted }]}
                                        numberOfLines={1}
                                    >
                                        {inst.responseTime}
                                    </Text>
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
                        <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} />
                        <Text style={[s.chatBoxTitle, { color: colors.text }]}>
                            {activeChannel === 'instructors'
                                ? `گفتگو با ${activeInstructor.name} (${activeInstructor.itemTitle})`
                                : activeChannel === 'course_group'
                                  ? 'گروه تعاملی دانش‌پذیران دوره طراحی آینده'
                                  : 'پشتیبانی اختصاصی و هماهنگی کلاس‌ها'}
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
                            placeholder="پیام یا سؤال خود را بنویسید..."
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
                            <Text style={s.sendBtnText}>ارسال</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}

const s = StyleSheet.create({
    page: { padding: 16, paddingBottom: 32, gap: 14 },
    headerCard: { borderRadius: 22, padding: 16, gap: 8 },
    headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    headerSub: { color: '#C5D7CA', fontSize: 12, lineHeight: 18 },
    channelTabs: {
        flexDirection: 'row',
        gap: 6,
        backgroundColor: '#0B281F',
        padding: 4,
        borderRadius: 14,
        marginTop: 6,
    },
    channelTab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
    channelTabText: { fontSize: 11, fontWeight: '800' },
    instructorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    instructorCard: {
        width: '48%',
        borderWidth: 1.5,
        borderRadius: 16,
        padding: 10,
        gap: 4,
    },
    instRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    instBadge: {
        backgroundColor: '#E6F4EA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    instBadgeText: { color: '#123E30', fontSize: 10, fontWeight: '800' },
    onlineDot: { width: 8, height: 8, borderRadius: 4 },
    instName: { fontSize: 13, fontWeight: '800' },
    instTitle: { fontSize: 11, fontWeight: '700' },
    instMeta: { fontSize: 10 },
    chatBox: { borderWidth: 1, borderRadius: 20, overflow: 'hidden' },
    chatBoxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderBottomWidth: 1,
    },
    chatBoxTitle: { fontSize: 13, fontWeight: '800', flex: 1 },
    messageList: { padding: 12, gap: 10 },
    messageBubble: { maxWidth: '88%', borderRadius: 16, padding: 12, gap: 4 },
    msgHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
    msgSender: { fontSize: 11, fontWeight: '800' },
    msgTime: { fontSize: 10 },
    msgText: { fontSize: 12, lineHeight: 20 },
    inputRow: {
        flexDirection: 'row',
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#D6F39A',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    sendBtnText: { color: '#123E30', fontSize: 12, fontWeight: '800' },
});
