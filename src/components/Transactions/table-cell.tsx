export default function Cell({ children, align = 'left', className = '' }: { children: React.ReactNode; align?: 'left' | 'right'; className?: string }) {
    return <td className={`px-4 py-3 ${align === 'right' ? 'text-right' : 'text-left'} ${className}`}>{children}</td>;
}
