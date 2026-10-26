import { RotateCcw } from 'lucide-react'
import { DEFAULT_CONTENT } from '../config'
import type { SiteContent } from '../shared/content'
import { ListArea } from './ListArea'
import { Field, Section, ghostButtonClass, inputClass } from './ui'

interface TextsEditorProps {
  content: SiteContent
  /** Muda a `key` para remontar os textareas após "restaurar". */
  resetKey: number
  onChange: (next: SiteContent) => void
  onReset: () => void
}

export function TextsEditor({ content, resetKey, onChange, onReset }: TextsEditorProps) {
  const { question, success } = content
  const setQuestion = (patch: Partial<SiteContent['question']>) => onChange({ ...content, question: { ...question, ...patch } })
  const setSuccess = (patch: Partial<SiteContent['success']>) => onChange({ ...content, success: { ...success, ...patch } })

  return (
    <>
      <Section title="Início do namoro" hint="Usado no contador de anos, meses e dias.">
        <Field label="Data e hora">
          <input
            type="datetime-local"
            className={inputClass}
            value={content.startDate.slice(0, 16)}
            onChange={(e) => e.target.value && onChange({ ...content, startDate: `${e.target.value}:00` })}
          />
        </Field>
      </Section>

      <Section title="Pergunta">
        <Field label="Pergunta">
          <input className={inputClass} value={question.title} maxLength={120} onChange={(e) => setQuestion({ title: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Botão “Sim”">
            <input className={inputClass} value={question.yes} maxLength={30} onChange={(e) => setQuestion({ yes: e.target.value })} />
          </Field>
          <Field label="Botão “Não”">
            <input className={inputClass} value={question.no} maxLength={30} onChange={(e) => setQuestion({ no: e.target.value })} />
          </Field>
        </div>
        <Field label="Mensagens provocativas do “Não”" hint="Uma por linha. Aparecem em ordem aleatória a cada fuga.">
          <ListArea key={`t${resetKey}`} initial={content.taunts} separator={'\n'} rows={7} onChange={(taunts) => onChange({ ...content, taunts })} />
        </Field>
      </Section>

      <Section title="Tela do “Sim”">
        <Field label="Título">
          <input className={inputClass} value={success.title} maxLength={120} onChange={(e) => setSuccess({ title: e.target.value })} />
        </Field>
        <Field label="Subtítulo">
          <input className={inputClass} value={success.subtitle} maxLength={200} onChange={(e) => setSuccess({ subtitle: e.target.value })} />
        </Field>
        <Field label="Título do contador">
          <input className={inputClass} value={success.counterTitle} maxLength={120} onChange={(e) => setSuccess({ counterTitle: e.target.value })} />
        </Field>
        <Field label="Título da galeria">
          <input className={inputClass} value={success.galleryTitle} maxLength={120} onChange={(e) => setSuccess({ galleryTitle: e.target.value })} />
        </Field>
      </Section>

      <Section title="Carta de amor">
        <Field label="Título da carta">
          <input className={inputClass} value={success.letterTitle} maxLength={120} onChange={(e) => setSuccess({ letterTitle: e.target.value })} />
        </Field>
        <Field label="Texto" hint="Separe os parágrafos com uma linha em branco.">
          <ListArea key={`l${resetKey}`} initial={success.letter} separator={'\n\n'} rows={9} onChange={(letter) => setSuccess({ letter })} />
        </Field>
        <Field label="Assinatura">
          <textarea className={inputClass} rows={2} value={success.signature} maxLength={200} onChange={(e) => setSuccess({ signature: e.target.value })} />
        </Field>
      </Section>

      <button type="button" className={`${ghostButtonClass} self-start`} onClick={onReset}>
        <RotateCcw size={16} /> Restaurar textos padrão ({DEFAULT_CONTENT.question.title})
      </button>
    </>
  )
}
