import type { ReactNode } from 'react';
import type { ManualBlock } from '@/lib/ops/manual-blocks';

function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(
        <strong key={key} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={key} className="text-[#F5C242]">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      const link = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (link) {
        const href = link[2];
        const external = href.startsWith('http');
        parts.push(
          <a
            key={key}
            href={href}
            className="text-[#F5C242] underline"
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            {link[1]}
          </a>
        );
      }
    }
    last = match.index + token.length;
    key += 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function OpsReferenceManual({
  kicker,
  title,
  note = 'Internal reference. Approving a caption still leaves the send in your hands.',
  downloadHref,
  blocks,
}: {
  kicker: string;
  title: string;
  note?: string;
  downloadHref?: string;
  blocks: ManualBlock[];
}) {
  return (
    <section className="mb-8 rounded-2xl border border-[#F5C242]/35 bg-white/[0.04]">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F5C242]/80">{kicker}</p>
          <h2 className="mt-1 text-lg font-bold">{title}</h2>
          <p className="mt-1 text-xs text-white/50">{note}</p>
        </div>
        {downloadHref ? (
          <a
            href={downloadHref}
            className="shrink-0 rounded-xl border border-[#F5C242]/50 px-3 py-2 text-center text-xs font-bold text-[#F5C242]"
          >
            Download PDF
          </a>
        ) : null}
      </div>
      <div className="max-h-[32rem] overflow-y-auto px-4 py-4 sm:px-5">
        <article className="space-y-3 text-sm leading-6 text-white/75">
          {blocks.map((block, index) => {
            if (block.type === 'h1') {
              return (
                <h3 key={index} className="pt-2 text-base font-bold text-white">
                  <Inline text={block.text} />
                </h3>
              );
            }
            if (block.type === 'h2') {
              return (
                <h3 key={index} className="pt-4 text-base font-bold text-[#F5C242]">
                  <Inline text={block.text} />
                </h3>
              );
            }
            if (block.type === 'h3') {
              return (
                <h4 key={index} className="pt-2 text-sm font-bold text-white">
                  <Inline text={block.text} />
                </h4>
              );
            }
            if (block.type === 'p') {
              return (
                <p key={index}>
                  <Inline text={block.text} />
                </p>
              );
            }
            if (block.type === 'ul' || block.type === 'ol') {
              const List = block.type === 'ol' ? 'ol' : 'ul';
              return (
                <List
                  key={index}
                  className={block.type === 'ol' ? 'list-decimal space-y-1 pl-5' : 'list-disc space-y-1 pl-5'}
                >
                  {block.items.map((item) => (
                    <li key={item}>
                      <Inline text={item} />
                    </li>
                  ))}
                </List>
              );
            }
            if (block.type === 'table') {
              return (
                <div key={index} className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/15 text-white/50">
                        {block.headers.map((header) => (
                          <th key={header} className="px-2 py-2 font-semibold">
                            <Inline text={header} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row) => (
                        <tr key={row.join('|')} className="border-b border-white/10 align-top">
                          {row.map((cell, cellIndex) => (
                            <td key={`${cell}-${cellIndex}`} className="px-2 py-2">
                              <Inline text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (block.type === 'hr') {
              return <hr key={index} className="border-white/10" />;
            }
            if (block.type === 'pre') {
              return (
                <pre key={index} className="overflow-x-auto rounded-xl bg-black/30 p-3 text-xs text-white/80">
                  {block.text}
                </pre>
              );
            }
            return null;
          })}
        </article>
      </div>
    </section>
  );
}
