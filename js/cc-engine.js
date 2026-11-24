/* CompilerLab — engine mô phỏng lexer, parser và tối ưu IR */
(function () {
  "use strict";

  const SEED = window.CC_SEED;
  if (!SEED) return;

  const fmt = new Intl.NumberFormat("vi-VN");

  function clampInt(value, min, max, fallback) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function runLex(input) {
    const box = input || {};
    const chars = clampInt(box.chars, 20, 500, 400);
    const wsPct = clampInt(box.wsPct, 5, 40, 25);
    const commentPct = clampInt(box.commentPct, 0, 30, 15);
    const codeChars = round1(chars * (1 - wsPct / 100) * (1 - commentPct / 100));
    const tokens = Math.round(codeChars / 4);
    const ok = tokens > 0;
    const trace = [
      {
        step: "source",
        label: "Nguồn",
        result: "ok",
        note: `${chars} ký tự · trắng ${wsPct}% · chú thích ${commentPct}%`
      },
      {
        step: "code",
        label: "Ký tự mã thực",
        result: "ok",
        note: `${codeChars} ký tự sau khi bỏ trắng và chú thích`
      },
      {
        step: "tokens",
        label: "Token",
        result: ok ? "ok" : "fail",
        note: `${tokens} token · 4 ký tự mỗi token`
      }
    ];
    return {
      ok,
      verdict: ok ? "Có token" : "Rỗng",
      meta: `${tokens} token`,
      statusText: `${tokens} token từ ${codeChars} ký tự mã`,
      tags: ["Lexer", `${tokens} token`],
      trace,
      payload: {
        nguồn: `${chars} ký tự`,
        "ký tự mã": codeChars,
        token: tokens
      },
      metrics: [
        { label: "Ký tự mã", value: codeChars },
        { label: "Token", value: tokens },
        { label: "Trắng", value: `${wsPct}%` },
        { label: "Kết luận", value: ok ? "có token" : "rỗng" }
      ],
      values: { chars, wsPct, commentPct, codeChars, tokens, ok: ok ? 1 : 0 }
    };
  }

  function runAst(input) {
    const box = input || {};
    const statements = clampInt(box.statements, 1, 50, 10);
    const depth = clampInt(box.depth, 1, 10, 3);
    const errors = clampInt(box.errors, 0, 10, 0);
    const nodes = statements * (2 + depth);
    const ok = errors === 0;
    const trace = [
      {
        step: "parse",
        label: "Câu lệnh",
        result: "ok",
        note: `${statements} câu · lồng ${depth} tầng`
      },
      {
        step: "errors",
        label: "Lỗi cú pháp",
        result: ok ? "ok" : "fail",
        note: ok ? "Không có lỗi" : `${errors} lỗi, parser dừng`
      },
      {
        step: "tree",
        label: "Cây cú pháp",
        result: ok ? "ok" : "warn",
        note: ok ? `${nodes} nút dựng xong` : "Không dựng được cây"
      }
    ];
    return {
      ok,
      verdict: ok ? "Dựng được" : "Dừng",
      meta: ok ? `${nodes} nút` : `${errors} lỗi`,
      statusText: ok ? `${nodes} nút cây cú pháp` : `dừng vì ${errors} lỗi`,
      tags: ["Parser", `${depth} tầng`],
      trace,
      payload: {
        "câu lệnh": statements,
        "độ sâu": depth,
        lỗi: errors,
        "nút": ok ? nodes : 0
      },
      metrics: [
        { label: "Câu lệnh", value: statements },
        { label: "Độ sâu", value: depth },
        { label: "Nút", value: ok ? nodes : 0 },
        { label: "Kết luận", value: ok ? "dựng được" : "dừng" }
      ],
      values: { statements, depth, errors, nodes, ok: ok ? 1 : 0 }
    };
  }

  function runOpt(input) {
    const box = input || {};
    const irOps = clampInt(box.irOps, 10, 500, 200);
    const foldPct = clampInt(box.foldPct, 0, 60, 50);
    const deadPct = clampInt(box.deadPct, 0, 40, 20);
    const finalOps = Math.max(1, Math.round(irOps * (1 - foldPct / 100) * (1 - deadPct / 100)));
    const speedup = round1(irOps / finalOps);
    const savedPct = round1(((irOps - finalOps) / irOps) * 100);
    const ok = speedup >= 1.5;
    const trace = [
      {
        step: "ir",
        label: "IR ban đầu",
        result: "ok",
        note: `${irOps} lệnh`
      },
      {
        step: "passes",
        label: "Hai lượt tối ưu",
        result: "ok",
        note: `gấp hằng ${foldPct}% · bỏ mã chết ${deadPct}%`
      },
      {
        step: "final",
        label: "Còn lại",
        result: ok ? "ok" : "warn",
        note: `${finalOps} lệnh · giảm ${savedPct}%`
      },
      {
        step: "verdict",
        label: "Kết luận",
        result: ok ? "ok" : "fail",
        note: `nhanh ${speedup} lần · ${ok ? "đáng kể" : "chưa đáng kể"}`
      }
    ];
    return {
      ok,
      verdict: ok ? "Đáng kể" : "Nhẹ",
      meta: `${finalOps} lệnh · ${speedup}×`,
      statusText: `${speedup}× · còn ${finalOps} lệnh`,
      tags: ["Tối ưu", `giảm ${savedPct}%`],
      trace,
      payload: {
        "IR gốc": irOps,
        "còn lại": finalOps,
        "giảm": `${savedPct}%`,
        "tốc độ": `${speedup}×`
      },
      metrics: [
        { label: "IR gốc", value: irOps },
        { label: "Còn lại", value: finalOps },
        { label: "Giảm", value: `${savedPct}%` },
        { label: "Kết luận", value: `${speedup}×` }
      ],
      values: { irOps, foldPct, deadPct, finalOps, speedup, savedPct, ok: ok ? 1 : 0 }
    };
  }

  function run(kind, values) {
    if (kind === "lex") return runLex(values);
    if (kind === "ast") return runAst(values);
    if (kind === "opt") return runOpt(values);
    throw new Error("Không rõ lát cắt: " + kind);
  }

  window.CC_ENGINE = { run, formatNumber: (n) => fmt.format(n), round1, clampInt };
})();
