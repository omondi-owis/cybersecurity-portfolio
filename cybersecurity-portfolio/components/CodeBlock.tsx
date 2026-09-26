interface Props {
  lang: string;
  code: string;
  caption?: string;
}

export default function CodeBlock({ lang, code, caption }: Props) {
  return (
    <figure className="codeblock">
      <div className="codeblock-head" aria-hidden="true">
        <span>{caption ?? lang}</span>
        <span>{lang}</span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      {caption ? <figcaption className="hp">{caption}</figcaption> : null}
    </figure>
  );
}
