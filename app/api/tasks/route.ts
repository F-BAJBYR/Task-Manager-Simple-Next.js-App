let tasks: {
  id: number;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}[] = [];

export async function GET() {
  return Response.json(tasks);
}

export async function POST(req: Request) {
  const { title, priority } = await req.json();
  const newTask = {
    id: Date.now(),
    title,
    completed: false,
    priority: priority || "medium",
  };
  tasks.push(newTask);
  return Response.json(newTask);
}

export async function PUT(req: Request) {
  const { id, title, completed, priority } = await req.json();
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, title, completed, priority }
      : task
  );
  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  tasks = tasks.filter(task => task.id !== id);
  return Response.json({ success: true });
}