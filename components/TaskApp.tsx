"use client";
import { useEffect, useState } from "react";

type Task = {
    id: number;
    title: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
};

const priorities = {
    high: { label: "عالية", color: "text-red-500" },
    medium: { label: "متوسطة", color: "text-yellow-500" },
    low: { label: "منخفضة", color: "text-green-500" },
};

export default function TaskApp() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [editId, setEditId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [filter, setFilter] = useState<"all" | "done" | "notdone">("all");

    const fetchTasks = async () => {
        const res = await fetch("/api/tasks");
        setTasks(await res.json());
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (!newTask.trim()) return;
        await fetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify({ title: newTask, priority }),
        });
        setNewTask("");
        setPriority("medium");
        fetchTasks();
    };

    const deleteTask = async (id: number) => {
        await fetch("/api/tasks", {
            method: "DELETE",
            body: JSON.stringify({ id }),
        });
        fetchTasks();
    };

    const toggleTask = async (task: Task) => {
        await fetch("/api/tasks", {
            method: "PUT",
            body: JSON.stringify({ ...task, completed: !task.completed }),
        });
        fetchTasks();
    };

    const saveEdit = async (task: Task) => {
        await fetch("/api/tasks", {
            method: "PUT",
            body: JSON.stringify({ ...task, title: editTitle }),
        });
        setEditId(null);
        setEditTitle("");
        fetchTasks();
    };

    const filteredTasks = tasks.filter(task =>
        filter === "all"
            ? true
            : filter === "done"
                ? task.completed
                : !task.completed
    );

    // إحصائيات
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const notDone = total - done;
    const high = tasks.filter(t => t.priority === "high").length;
    const medium = tasks.filter(t => t.priority === "medium").length;
    const low = tasks.filter(t => t.priority === "low").length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e9f0fb] px-4 py-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-[#3a86ff] mb-2 flex items-center justify-center gap-2">
                    <span>📋</span> قائمة المهام
                </h1>
                <p className="text-center text-gray-500 mb-8">نظم مهامك واجعل يومك أكثر إنتاجية</p>
                {/* البطاقات الإحصائية */}
                <div className="flex gap-4 mb-8 justify-center flex-wrap">
                    <div className="card-stat flex-1 text-center min-w-[180px]">
                        <div className="text-[#3a86ff] font-bold flex items-center justify-center gap-1 mb-2">
                            🎯 إجمالي المهام
                        </div>
                        <div className="text-2xl font-bold text-[#3a86ff]">{total}</div>
                    </div>
                    <div className="card-stat flex-1 text-center min-w-[180px]">
                        <div className="text-green-600 font-bold flex items-center justify-center gap-1 mb-2">
                            ✔️ مكتملة
                        </div>
                        <div className="text-2xl font-bold text-green-600">{done}</div>
                        <div className="mt-2 text-xs text-gray-400">{total ? `${Math.round((done / total) * 100)}% مكتمل` : "0% مكتمل"}</div>
                    </div>
                    <div className="card-stat flex-1 text-center min-w-[180px]">
                        <div className="text-yellow-500 font-bold flex items-center justify-center gap-1 mb-2">
                            ⏳ قيد التنفيذ
                        </div>
                        <div className="text-2xl font-bold text-yellow-500">{notDone}</div>
                        <div className="flex flex-col gap-1 mt-2 text-xs text-left">
                            <span className="text-red-500">عالية: {high}</span>
                            <span className="text-yellow-500">متوسطة: {medium}</span>
                            <span className="text-green-500">منخفضة: {low}</span>
                        </div>
                    </div>
                </div>
                {/* إضافة مهمة */}
                <div className="flex gap-2 mb-6">
                    <button
                        className="btn-main flex items-center gap-1"
                        onClick={addTask}
                    >
                        إضافة <span className="text-lg">+</span>
                    </button>
                    <select
                        className="border rounded px-2 py-2 bg-white"
                        value={priority}
                        onChange={e => setPriority(e.target.value as Task["priority"])}
                    >
                        <option value="medium">متوسطة</option>
                        <option value="high">عالية</option>
                        <option value="low">منخفضة</option>
                    </select>
                    <input
                        type="text"
                        className="border rounded px-3 py-2 flex-1 bg-white text-[#22223b]"
                        placeholder="أضف مهمة جديدة..."
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addTask()}
                    />
                </div>
                {/* تصفية */}
        // ...existing code...
                <div className="flex gap-2 mb-4 justify-center">
                    <button
                        className={`btn-filter ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        الكل
                    </button>
                    <button
                        className={`btn-filter ${filter === "done" ? "active" : ""}`}
                        onClick={() => setFilter("done")}
                    >
                        منجز
                    </button>
                    <button
                        className={`btn-filter ${filter === "notdone" ? "active" : ""}`}
                        onClick={() => setFilter("notdone")}
                    >
                        غير منجز
                    </button>
                </div>
                {/* قائمة المهام */}
                <ul className="space-y-3 mt-8">
                    {filteredTasks.map(task => (
                        <li
                            key={task.id}
                            className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm bg-white transition-all duration-300 ${task.completed ? "opacity-60" : ""
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task)}
                                className="w-5 h-5 accent-blue-500"
                            />
                            {editId === task.id ? (
                                <>
                                    <input
                                        className="border rounded px-2 py-1 flex-1"
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && saveEdit(task)}
                                    />
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={() => saveEdit(task)}
                                    >
                                        حفظ
                                    </button>
                                    <button
                                        className="bg-gray-300 px-2 py-1 rounded"
                                        onClick={() => setEditId(null)}
                                    >
                                        إلغاء
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span
                                        className={`flex-1 text-lg ${task.completed ? "line-through text-gray-400" : ""}`}
                                    >
                                        {task.title}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${priorities[task.priority].color}`}>
                                        {priorities[task.priority].label}
                                    </span>
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                                        onClick={() => {
                                            setEditId(task.id);
                                            setEditTitle(task.title);
                                        }}
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        حذف
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                    {filteredTasks.length === 0 && (
                        <li className="text-center py-12 text-gray-400 flex flex-col items-center">
                            <span className="text-5xl mb-4">📋</span>
                            <span className="text-xl font-bold mb-2">لا توجد مهام بعد</span>
                            <span className="text-sm">أضف أول مهمة لك لتبدأ رحلة الإنتاجية</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}