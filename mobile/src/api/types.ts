// Shared payload types mirroring the Laravel /api/v1 responses + extended mobile features.

export interface CourseLessonPayload {
    id: number;
    title: string;
    duration?: string | null;
    video_url?: string | null;
    description?: string | null;
    is_free?: boolean;
    sort_order?: number;
    completed?: boolean;
}

export interface CourseModulePayload {
    id: number;
    title: string;
    description?: string | null;
    sort_order?: number;
    lessons: CourseLessonPayload[];
}

export interface InstructorPayload {
    id: number;
    name: string;
    title?: string | null;
    avatar?: string | null;
    bio?: string | null;
}

export interface CoursePayload {
    id: number;
    slug: string;
    title: string;
    subtitle?: string | null;
    summary?: string | null;
    description?: string | null;
    category?: string | null;
    delivery_mode?: string | null;
    level?: string | null;
    duration?: string | null;
    lessons_count?: number | null;
    students_count?: number | null;
    price: number;
    discount_price?: number | null;
    is_free?: boolean;
    is_featured?: boolean;
    thumbnail?: string | null;
    intro_video_url?: string | null;
    rating?: number | null;
    instructor?: InstructorPayload | null;
    modules?: CourseModulePayload[];
}

export interface ProductPayload {
    id: number;
    slug: string;
    title: string;
    author?: string | null;
    type?: string | null;
    category?: string | null;
    price: number;
    discount_price?: number | null;
    stock?: number | null;
    is_digital?: boolean;
    is_featured?: boolean;
    image?: string | null;
    description?: string | null;
    pages?: number | null;
    publisher?: string | null;
    isbn?: string | null;
    rating?: number | null;
}

export interface UserPayload {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
    city?: string | null;
    job_title?: string | null;
    bio?: string | null;
    referral_code?: string | null;
}

export interface EnrollmentPayload {
    id: number;
    progress: number;
    completed_at?: string | null;
    enrolled_at?: string | null;
    course: CoursePayload | null;
}

export interface OrderItemPayload {
    id: number;
    title: string;
    item_type: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface OrderPayload {
    id: number;
    order_number: string;
    total: number;
    status: string;
    payment_status: string;
    created_at?: string | null;
    items: OrderItemPayload[];
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ContinueLessonBanner {
    course_slug: string;
    course_title: string;
    lesson_id: number;
    lesson_title: string;
    progress: number;
    remaining_minutes: number;
}

export interface HomeData {
    site: {
        name?: string;
        tagline?: string;
        hero_title?: string;
        hero_subtitle?: string;
        phone?: string;
        email?: string;
    };
    stats: Array<{ id: number; label: string; value: string; icon?: string | null }>;
    featured_courses: CoursePayload[];
    featured_products: ProductPayload[];
    testimonials: Array<{
        id: number;
        name: string;
        role?: string | null;
        avatar?: string | null;
        content: string;
        rating: number;
    }>;
    continue_lesson?: ContinueLessonBanner | null;
}

export interface GamificationStats {
    streak_days: number;
    xp: number;
    level: number;
    level_title: string;
    next_level_xp: number;
    weekly_goal_minutes: number;
    weekly_studied_minutes: number;
}

export interface ReminderSettingsPayload {
    enabled: boolean;
    incomplete_courses: boolean;
    course_frequency: 'daily' | 'every_2_days' | 'weekly';
    course_preferred_time: string;
    coaching_sessions: boolean;
    session_lead_times: string[];
    channels: {
        push: boolean;
        sms: boolean;
        telegram: boolean;
        email: boolean;
    };
    quiet_hours_enabled: boolean;
    quiet_hours_start: string;
    quiet_hours_end: string;
    recent_logs: Array<{
        id: number;
        title: string;
        channel: string;
        sent_at: string;
        status: 'delivered' | 'scheduled';
    }>;
}

export interface CoachingSessionPayload {
    id: number;
    title: string;
    coach_name: string;
    coach_title: string;
    date_label: string;
    time_label: string;
    duration_minutes: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    meeting_url?: string | null;
    notes?: string | null;
}

export interface GoalPayload {
    id: number;
    title: string;
    category: string;
    target_date: string;
    progress: number;
    completed: boolean;
}

export interface CertificatePayload {
    id: number;
    code: string;
    course_title: string;
    issued_at: string;
    grade: string;
    download_url: string;
}

export interface SupportTicketPayload {
    id: number;
    subject: string;
    department: string;
    status: 'answered' | 'pending' | 'closed';
    updated_at: string;
    last_message: string;
}

export interface DashboardData {
    user: UserPayload;
    stats: {
        enrolled_count: number;
        completed_count: number;
        in_progress_count: number;
        orders_count: number;
        certificates_count: number;
    };
    gamification?: GamificationStats;
    enrollments: EnrollmentPayload[];
    recent_orders: OrderPayload[];
}

export interface AuthData {
    token: string;
    user: UserPayload;
}

export interface LessonNotePayload {
    id: number;
    lesson_id: number;
    lesson_title: string;
    content: string;
    created_at: string;
}

export interface LearningData {
    course: CoursePayload;
    enrollment: {
        progress: number;
        completed_at?: string | null;
    } | null;
    completed_lesson_ids?: number[];
    saved_notes?: LessonNotePayload[];
}
