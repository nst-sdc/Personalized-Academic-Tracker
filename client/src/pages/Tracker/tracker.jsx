import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../../components/ui/dialog";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const initialGrades = [
  { id: 1, subject: "Math", grade: 92, deadline: "2024-06-10" },
  { id: 2, subject: "Physics", grade: 85, deadline: "2024-06-15" },
  { id: 3, subject: "English", grade: 78, deadline: "2024-06-12" },
];

const subjects = ["Math", "Physics", "English", "Chemistry", "Biology", "History", "Geography"];

export default function Tracker({ darkMode = false }) {
  const [grades, setGrades] = useState(initialGrades);
  const [form, setForm] = useState({ subject: "", grade: "", deadline: "" });
  const [open, setOpen] = useState(false);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (value) => {
    setForm({ ...form, subject: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.subject || !form.grade || !form.deadline) return;
    setGrades([
      ...grades,
      { id: Date.now(), subject: form.subject, grade: Number(form.grade), deadline: form.deadline },
    ]);
    setForm({ subject: "", grade: "", deadline: "" });
    setOpen(false);
  };

  const avg = grades.length ? (grades.reduce((a, b) => a + b.grade, 0) / grades.length).toFixed(1) : 0;
  const best = grades.length ? Math.max(...grades.map(g => g.grade)) : 0;
  const worst = grades.length ? Math.min(...grades.map(g => g.grade)) : 0;

  const chartData = {
    labels: grades.map(g => g.subject),
    datasets: [
      {
        label: "Grade",
        data: grades.map(g => g.grade),
        backgroundColor: [
          "#60a5fa",
          "#34d399",
          "#fbbf24",
          "#f87171",
          "#a78bfa",
          "#818cf8",
          "#f472b6"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`${darkMode ? "bg-slate-900 text-white" : "bg-white text-black"} min-h-screen w-full`}>
      <div className="max-w-5xl mx-auto py-10 px-2 md:px-0">
      <h1 className="text-3xl font-bold mb-6">Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{avg}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Best Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{best}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lowest Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400">{worst}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Grades & Assignments</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Add Grade</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add Grade / Assignment</DialogTitle>
              <DialogDescription>Enter your grade and assignment deadline.</DialogDescription>
              <form onSubmit={handleAdd} className="space-y-4 mt-4">
                <Select value={form.subject} onValueChange={handleSelect} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="grade"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Grade (0-100)"
                  value={form.grade}
                  onChange={handleInput}
                  required
                />
                <Input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleInput}
                  required
                />
                <div className="flex gap-2 justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" variant="default">Add</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>{g.subject}</TableCell>
                  <TableCell>{g.grade}</TableCell>
                  <TableCell>{g.deadline}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 flex items-center justify-center">
            <Pie data={chartData} options={{ plugins: { legend: { position: 'right' } } }} />
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
