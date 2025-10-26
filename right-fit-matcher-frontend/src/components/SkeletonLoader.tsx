export function SearchCardSkeleton() {
    return (
        <div className="border-2 border-gray-200 rounded-xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded-md w-2/3 mb-4"></div>
                    <div className="flex flex-wrap gap-2">
                        <div className="h-7 bg-gray-200 rounded-full w-24"></div>
                        <div className="h-7 bg-gray-200 rounded-full w-24"></div>
                        <div className="h-7 bg-gray-200 rounded-full w-24"></div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded-md w-24 mb-2"></div>
                    <div className="h-9 bg-gray-200 rounded-lg w-28"></div>
                </div>
            </div>
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded-md w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-md"></div>
        </div>
    );
}

