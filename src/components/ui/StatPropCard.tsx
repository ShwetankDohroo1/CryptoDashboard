import { Card, CardContent, CardHeader, CardTitle } from "./card";

type StatCardProps = {
    title: string;
    value: string;
};

export function StatCard({ title, value }: StatCardProps) {
    return (
        <Card className="bg-gray-200 shadow-md rounded-xl hover:shadow-xl transition-shadow">
            <CardHeader>
                <CardTitle className="text-gray-700 text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-2xl font-bold text-blue-600 ${title === 'Change (24hr)' ? (+value < 0 ? 'text-red-500' : 'text-green-600') : ''}`}>{value}</p>
            </CardContent>
        </Card>
    );
}