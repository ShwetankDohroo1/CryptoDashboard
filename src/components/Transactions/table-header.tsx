export default function Header({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
    return <th className={`px-4 py-2 ${align === 'right' ? 'text-right' : 'text-left'}`}>{children}</th>;
}
