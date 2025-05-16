//func that fetches users past transactions from db
export async function fetchTransactionData(fingerprintId: string) {
    const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprintId }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch transactions');
    }

    return res.json();
}
