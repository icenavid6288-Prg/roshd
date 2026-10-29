// The Laravel API wraps all successful responses, including paginators, in data.
export function normalizeApiPayload(path: string, payload: unknown): unknown {
    const envelope = payload as { data?: unknown } | null;
    const data = envelope && typeof envelope === 'object' && 'data' in envelope ? envelope.data : payload;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
    const record = data as Record<string, any>;
    if (path === '/api/v1/home') {
        return { ...record, stats: record.stats ?? [], testimonials: record.testimonials ?? [],
            featured_courses: record.featured_courses ?? record.latest_courses ?? [],
            featured_products: record.featured_products ?? record.latest_products ?? [] };
    }
    if (path === '/api/v1/dashboard') {
        const enrollments = (record.enrollments ?? []).map((entry: Record<string, any>) => ({ ...entry, progress: entry.progress_percent ?? entry.progress ?? 0 }));
        const orders = record.recent_orders ?? record.orders ?? [];
        return { ...record, enrollments, recent_orders: orders, stats: record.stats ?? {
            enrolled_count: enrollments.length,
            completed_count: enrollments.filter((entry: Record<string, any>) => entry.completed_at).length,
            in_progress_count: enrollments.filter((entry: Record<string, any>) => !entry.completed_at).length,
            orders_count: orders.length,
        } };
    }
    if (record.curriculum && !record.modules) return { ...record, modules: record.curriculum };
    return data;
}
