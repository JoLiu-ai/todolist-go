<div className="notes-section">
    <h3 className="text-xl font-semibold mb-4">阅读笔记</h3>
    {notes.length === 0 ? (
        <div className="text-gray-500">暂无笔记</div>
    ) : (
        <div className="space-y-4">
            {notes.map(note => (
                <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">
                        {formatDate(note.createdAt)}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{note.content}</p>
                </div>
            ))}
        </div>
    )}
</div> 