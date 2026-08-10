'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import {
  getAdminLesson,
  updateLesson,
  deleteLesson,
  createQuestion,
  deleteQuestion,
  createVocab,
  AdminLesson,
} from '@/lib/admin-services';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditLessonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<AdminLesson | null>(null);
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const [qPrompt, setQPrompt] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qOrder, setQOrder] = useState('1');

  const [vWord, setVWord] = useState('');
  const [vMeaning, setVMeaning] = useState('');
  const [vExample, setVExample] = useState('');

  const load = () => {
    getAdminLesson(id).then((data) => {
      setLesson(data);
      setTitle(data.title);
      setIsPublished(data.isPublished);
      const body = (data.content as { body?: string } | null)?.body ?? '';
      setContentText(body);
      setQOrder(String((data.questions?.length ?? 0) + 1));
    });
  };

  useEffect(load, [id]);

  const saveLesson = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateLesson(id, {
      title,
      isPublished,
      content: { body: contentText },
    });
    setSaving(false);
    load();
  };

  const addQuestion = async (e: FormEvent) => {
    e.preventDefault();
    await createQuestion(id, {
      type: 'MULTIPLE_CHOICE',
      order: Number(qOrder),
      prompt: qPrompt,
      correctAnswer: qAnswer,
      explanation: qExplanation,
      options: [qAnswer, 'Wrong option A', 'Wrong option B'],
    });
    setQPrompt('');
    setQAnswer('');
    setQExplanation('');
    load();
  };

  const addVocab = async (e: FormEvent) => {
    e.preventDefault();
    await createVocab(id, { word: vWord, meaningMn: vMeaning, exampleSentence: vExample });
    setVWord('');
    setVMeaning('');
    setVExample('');
    load();
  };

  const removeLesson = async () => {
    if (!confirm('Энэ хичээлийг устгах уу?')) return;
    await deleteLesson(id);
    router.push('/admin');
  };

  if (!lesson) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-mist-400 hover:text-mist-50">
        <ArrowLeft className="h-4 w-4" /> Буцах
      </Link>

      <div className="rounded-xl border border-ink-700 bg-ink-900 p-5 text-sm text-mist-400">
        {lesson.module.unit.level.code} · {lesson.module.unit.title} · {lesson.module.title}
      </div>

      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Хичээл засах</h2>
        <form onSubmit={saveLesson} className="space-y-4 max-w-xl">
          <Input label="Гарчиг" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-mist-200">Агуулга</label>
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-mist-50 focus:border-brand focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Нийтлэгдсэн
          </label>
          <div className="flex gap-3">
            <Button type="submit" isLoading={saving}>Хадгалах</Button>
            <Button type="button" variant="ghost" onClick={removeLesson} className="text-danger">
              <Trash2 className="h-4 w-4" /> Устгах
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Асуултууд ({lesson.questions.length})</h2>
        <ul className="mb-4 space-y-2">
          {lesson.questions.map((q) => (
            <li key={q.id} className="flex items-start justify-between rounded-lg border border-ink-700 bg-ink-800 p-3 text-sm">
              <div>
                <span className="text-xs text-mist-500">#{q.order}</span>
                <p className="font-medium">{q.prompt}</p>
                <p className="text-mist-400">Зөв: {String(q.correctAnswer)}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteQuestion(q.id).then(load)}
                className="text-danger hover:opacity-80"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addQuestion} className="space-y-3 max-w-xl rounded-xl border border-dashed border-ink-600 p-4">
          <p className="text-sm font-medium text-mist-300 flex items-center gap-1">
            <Plus className="h-4 w-4" /> Асуулт нэмэх
          </p>
          <Input label="Асуулт" value={qPrompt} onChange={(e) => setQPrompt(e.target.value)} required />
          <Input label="Зөв хариулт" value={qAnswer} onChange={(e) => setQAnswer(e.target.value)} required />
          <Input label="Тайлбар (буруу үед)" value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} required />
          <Input label="Дараалал" type="number" value={qOrder} onChange={(e) => setQOrder(e.target.value)} />
          <Button type="submit" variant="secondary">Асуулт нэмэх</Button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Үгийн сан ({lesson.vocabItems.length})</h2>
        <ul className="mb-4 space-y-2">
          {lesson.vocabItems.map((v) => (
            <li key={v.id} className="rounded-lg border border-ink-700 bg-ink-800 p-3 text-sm">
              <strong>{v.word}</strong> — {v.meaningMn}
              <p className="text-mist-400 italic">{v.exampleSentence}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={addVocab} className="space-y-3 max-w-xl rounded-xl border border-dashed border-ink-600 p-4">
          <p className="text-sm font-medium text-mist-300 flex items-center gap-1">
            <Plus className="h-4 w-4" /> Үг нэмэх
          </p>
          <Input label="Үг (англи)" value={vWord} onChange={(e) => setVWord(e.target.value)} required />
          <Input label="Утга (монгол)" value={vMeaning} onChange={(e) => setVMeaning(e.target.value)} required />
          <Input label="Жишээ өгүүлбэр" value={vExample} onChange={(e) => setVExample(e.target.value)} required />
          <Button type="submit" variant="secondary">Үг нэмэх</Button>
        </form>
      </section>
    </div>
  );
}
