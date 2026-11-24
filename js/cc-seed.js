/* CompilerLab — dữ liệu mô phỏng tách token, cây cú pháp và tối ưu mã */
window.CC_SEED = {
  lab: {
    heading: "Ba chặng của trình biên dịch",
    intro: "Đo số token sau khi bỏ khoảng trắng và chú thích, dựng cây cú pháp từ câu lệnh và tính mức giảm lệnh sau tối ưu. Engine viết tay, kết quả tất định để đối chiếu từng nhiệm vụ.",
    tabs: [
      {
        id: "lex",
        label: "Tách token",
        title: "Lexer",
        badge: "token",
        runLabel: "Đếm token",
        hint: "Khoảng trắng và chú thích không tạo token. Ước lượng 4 ký tự mã cho một token; càng nhiều chú thích thì phần mã thực càng ít.",
        fields: [
          { id: "chars", label: "Ký tự nguồn", type: "number", min: 20, max: 500, step: 10, value: 400 },
          { id: "wsPct", label: "Khoảng trắng (%)", type: "number", min: 5, max: 40, step: 1, value: 25 },
          { id: "commentPct", label: "Chú thích (%)", type: "number", min: 0, max: 30, step: 1, value: 15 }
        ]
      },
      {
        id: "ast",
        label: "Cây cú pháp",
        title: "Parser",
        badge: "node",
        runLabel: "Dựng cây",
        hint: "Mỗi câu lệnh tạo một nút gốc và khoảng hai nút con mỗi tầng. Một lỗi cú pháp là cả cây không dựng được, phải sửa trước khi phân tích.",
        fields: [
          { id: "statements", label: "Số câu lệnh", type: "number", min: 1, max: 50, step: 1, value: 10 },
          { id: "depth", label: "Độ sâu lồng", type: "number", min: 1, max: 10, step: 1, value: 3 },
          { id: "errors", label: "Lỗi cú pháp", type: "number", min: 0, max: 10, step: 1, value: 0 }
        ]
      },
      {
        id: "opt",
        label: "Tối ưu",
        title: "Gấp hằng và bỏ mã chết",
        badge: "IR",
        runLabel: "Tối ưu mã",
        hint: "Lệnh cuối = lệnh IR × (1 − gấp hằng) × (1 − bỏ mã chết). Tốc độ tăng = lệnh gốc chia lệnh còn lại; từ 1,5 lần mới đáng kể.",
        fields: [
          { id: "irOps", label: "Lệnh IR", type: "number", min: 10, max: 500, step: 10, value: 200 },
          { id: "foldPct", label: "Gấp hằng (%)", type: "number", min: 0, max: 60, step: 5, value: 50 },
          { id: "deadPct", label: "Bỏ mã chết (%)", type: "number", min: 0, max: 40, step: 5, value: 20 }
        ]
      }
    ],
    defaults: {
      lex: { chars: 400, wsPct: 25, commentPct: 15 },
      ast: { statements: 10, depth: 3, errors: 0 },
      opt: { irOps: 200, foldPct: 50, deadPct: 20 }
    },
    presets: {
      lex: [
        { id: "cc-lex-base", label: "400 ký tự, 25% trắng", dataset: { chars: 400, wsPct: 25, commentPct: 15 } },
        { id: "cc-lex-dense", label: "Mã dày 10% trắng", dataset: { chars: 200, wsPct: 10, commentPct: 0 } },
        { id: "cc-lex-comment", label: "Chú thích 30%", dataset: { chars: 400, wsPct: 20, commentPct: 30 } }
      ],
      ast: [
        { id: "cc-ast-base", label: "10 câu, sâu 3", dataset: { statements: 10, depth: 3, errors: 0 } },
        { id: "cc-ast-deep", label: "Lồng sâu 6", dataset: { statements: 8, depth: 6, errors: 0 } },
        { id: "cc-ast-error", label: "Hai lỗi cú pháp", dataset: { statements: 10, depth: 3, errors: 2 } }
      ],
      opt: [
        { id: "cc-opt-base", label: "200 lệnh, giảm 60%", dataset: { irOps: 200, foldPct: 50, deadPct: 20 } },
        { id: "cc-opt-strong", label: "120 lệnh, nhanh 2,2×", dataset: { irOps: 120, foldPct: 40, deadPct: 25 } },
        { id: "cc-opt-weak", label: "Tối ưu nhẹ 10%", dataset: { irOps: 300, foldPct: 10, deadPct: 0 } }
      ]
    },
    examples: [
      { id: "ex-lex", kind: "lex", label: "Chú thích chiếm 30% thì sao?", dataset: { chars: 400, wsPct: 20, commentPct: 30 } },
      { id: "ex-ast", kind: "ast", label: "Có lỗi cú pháp thì cây ra sao?", dataset: { statements: 10, depth: 3, errors: 2 } },
      { id: "ex-opt", kind: "opt", label: "Tối ưu 60% lệnh nhanh bao nhiêu?", dataset: { irOps: 200, foldPct: 50, deadPct: 20 } }
    ],
    missions: [
      {
        id: "m-lex-tokens",
        kind: "lex",
        title: "Đếm token cơ bản",
        prompt: "Nguồn 400 ký tự, 25% khoảng trắng, 15% chú thích. Ghi lại số token ước lượng (4 ký tự mã mỗi token).",
        metric: "tokens",
        expect: 64,
        hint: "400 × 0,75 × 0,85 = 255 ký tự mã; chia 4 được 63,75, làm tròn 64 token.",
        dataset: { chars: 400, wsPct: 25, commentPct: 15 }
      },
      {
        id: "m-lex-dense",
        kind: "lex",
        title: "Mã dày đặc",
        prompt: "Nguồn 200 ký tự, chỉ 10% khoảng trắng và không chú thích. Ghi lại số token.",
        metric: "tokens",
        expect: 45,
        hint: "200 × 0,9 = 180 ký tự mã; 180 ÷ 4 = 45 token.",
        dataset: { chars: 200, wsPct: 10, commentPct: 0 }
      },
      {
        id: "m-ast-nodes",
        kind: "ast",
        title: "Đếm nút cây",
        prompt: "Mười câu lệnh, lồng sâu 3 tầng, không lỗi. Ghi lại số nút cây cú pháp.",
        metric: "nodes",
        expect: 50,
        hint: "Mỗi câu lệnh 2 + 3 nút: 10 × 5 = 50 nút.",
        dataset: { statements: 10, depth: 3, errors: 0 }
      },
      {
        id: "m-ast-ok",
        kind: "ast",
        title: "Cây có dựng được không?",
        prompt: "Mười câu lệnh, lồng sâu 3 tầng nhưng có 2 lỗi cú pháp. Engine phải kết luận không dựng được cây.",
        metric: "ok",
        expect: 0,
        hint: "Chỉ cần một lỗi cú pháp là parser dừng; đây có hai lỗi.",
        dataset: { statements: 10, depth: 3, errors: 2 }
      },
      {
        id: "m-opt-ops",
        kind: "opt",
        title: "Còn bao nhiêu lệnh?",
        prompt: "200 lệnh IR, gấp hằng 50% và bỏ mã chết 20%. Ghi lại số lệnh còn lại.",
        metric: "finalOps",
        expect: 80,
        hint: "200 × 0,5 × 0,8 = 80 lệnh.",
        dataset: { irOps: 200, foldPct: 50, deadPct: 20 }
      },
      {
        id: "m-opt-speed",
        kind: "opt",
        title: "Nhanh bao nhiêu lần?",
        prompt: "120 lệnh IR, gấp hằng 40% và bỏ mã chết 25%. Ghi lại tốc độ tăng (1 chữ số thập phân).",
        metric: "speedup",
        expect: 2.2,
        hint: "Còn 54 lệnh; 120 ÷ 54 ≈ 2,22 → 2,2 lần.",
        dataset: { irOps: 120, foldPct: 40, deadPct: 25 }
      }
    ]
  }
};

window.CC_SEED.home = {
  "title": "CompilerLab — Biên dịch, nhìn thấy từng bước",
  "eyebrow": "Khóa học tương tác · 12 bài · tiếng Việt",
  "h1": "Một dòng mã.<br><span class=\"hl\">Thấy</span> cả đường đi.",
  "sub": "Theo mã nguồn qua tách token, cây cú pháp, kiểm kiểu, IR và sinh mã máy. Mỗi bài là <strong>một sơ đồ sống</strong>, còn phòng mô phỏng đếm token, dựng cây và đo mức tối ưu ngay trong trình duyệt — không cần cài đặt.",
  "note": "Không backend. Kết quả tất định và tiến độ nằm trên máy bạn.",
  "startLabel": "Bắt đầu bài 01",
  "labLabel": "Mở phòng mô phỏng",
  "modesHead": "Bốn cách học, một đường ống biên dịch",
  "modesSub": "Không chỉ đọc lý thuyết. Bạn xem mã đi qua từng chặng, tự đo một cấu hình cụ thể và sửa hiểu nhầm ngay.",
  "modes": [
    {
      "title": "Học bằng sơ đồ sống",
      "desc": "Từng token, nút cây và lệnh IR hiện ra theo bước, kèm một chương trình cụ thể để đối chiếu.",
      "href": "#/learn",
      "icon": "process",
      "tone": "blue",
      "cta": "Vào lớp học"
    },
    {
      "title": "Luyện tập tình huống",
      "desc": "8 ca thường gặp: token sai, lỗi cú pháp, kiểu không khớp và tối ưu không đáng kể.",
      "href": "#/practice",
      "icon": "star",
      "tone": "coral",
      "cta": "Bắt đầu luyện"
    },
    {
      "title": "Phòng mô phỏng",
      "desc": "Đếm token sau khi bỏ trắng và chú thích, dựng cây cú pháp và đo tốc độ sau tối ưu, kèm 6 nhiệm vụ chấm điểm.",
      "href": "#/lab",
      "icon": "gateway",
      "tone": "violet",
      "cta": "Mở phòng mô phỏng"
    },
    {
      "title": "Cheatsheets",
      "desc": "Bảng token, bảng kiểu, các lượt tối ưu và checklist đọc IR — tra nhanh khi làm bài.",
      "href": "#/cheatsheets",
      "icon": "file",
      "tone": "green",
      "cta": "Mở bảng tra"
    }
  ],
  "outlineHead": "Lộ trình 12 bài",
  "outlineSub": "Từ ký tự thô đến mã máy: mỗi module trả lời một câu hỏi lớn của trình biên dịch.",
  "faq": [
    {
      "q": "Đây có phải trình biên dịch thật?",
      "a": "Không. Đây là mô phỏng viết tay cho khóa học: ước lượng số token, số nút cây và mức giảm lệnh IR. Đủ để thấy vì sao từng chặng tồn tại — không thay thế GCC, Clang hay LLVM."
    },
    {
      "q": "Vì sao số liệu mẫu cố định?",
      "a": "Dữ liệu cố định để kết quả tất định và dễ đối chiếu: 400 ký tự nguồn, 10 câu lệnh, 200 lệnh IR. Nhờ vậy nhiệm vụ có đáp án kiểm chứng được, không phụ thuộc đầu vào ngẫu nhiên."
    },
    {
      "q": "Có cần biết C hay Rust trước không?",
      "a": "Không bắt buộc. Bài học giải thích bằng sơ đồ và ví dụ; mã giả xuất hiện ở cheatsheet để tra khi cần. Người đã viết trình biên dịch nhỏ sẽ đi nhanh hơn ở phần IR."
    },
    {
      "q": "Dùng trên điện thoại hoặc máy chiếu được không?",
      "a": "Được. Giao diện responsive, thanh bên chuyển thành drawer và sơ đồ cuộn ngang trên màn hình nhỏ. Bảng kết quả vẫn đọc được; nên xoay ngang khi xem nhiều cột."
    }
  ],
  "letter": "C",
  "brand": "CompilerLab",
  "hero": {
    "bar": "cc://pipeline",
    "title": "tách token · dựng cây · kiểm kiểu · sinh mã",
    "aria": "Mã nguồn đi qua lexer, parser, kiểm kiểu và IR để ra mã máy",
    "states": [
      {
        "label": "Source"
      },
      {
        "label": "Token"
      },
      {
        "label": "AST"
      },
      {
        "label": "IR"
      }
    ],
    "final": "Bin",
    "queueSmall": "Kết quả",
    "queueChip": "Mã máy",
    "queueVerdict": "0 lỗi",
    "frames": [
      {
        "small": "Token",
        "b": "64",
        "cls": "hit"
      },
      {
        "small": "Lỗi cú pháp",
        "b": "chặn",
        "cls": "miss"
      },
      {
        "small": "Tối ưu",
        "b": "2,5×"
      }
    ]
  },
  "promo": {
    "eyebrow": "Phòng mô phỏng · chạy cục bộ",
    "h2": "Một dòng mã.<br>Ba chặng.",
    "p": "Đếm token sau khi bỏ khoảng trắng và chú thích, dựng cây cú pháp từ số câu lệnh và độ sâu, rồi đo số lệnh còn lại sau gấp hằng và bỏ mã chết. Sáu nhiệm vụ chấm điểm ngay trên kết quả, kèm gợi ý sửa từng cấu hình yếu.",
    "cta": "Mở phòng mô phỏng",
    "nodes": [
      {
        "icon": "file",
        "label": "Nguồn",
        "sub": ".c/.rs",
        "hot": true
      },
      {
        "icon": "grid",
        "label": "Lexer",
        "sub": "token"
      },
      {
        "icon": "check",
        "label": "Parser",
        "sub": "AST"
      },
      {
        "icon": "bolt",
        "label": "Kiểm kiểu",
        "sub": "symbol",
        "hot": true
      },
      {
        "icon": "layers",
        "label": "IR",
        "sub": "3 địa chỉ"
      },
      {
        "icon": "star",
        "label": "Tối ưu",
        "sub": "gấp hằng"
      },
      {
        "icon": "server",
        "label": "Sinh mã",
        "sub": "assembly"
      }
    ]
  }
};
window.COMPILERLAB = window.COMPILERLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
window.COMPILERLAB.home = window.CC_SEED.home;

(function () {
  const D = window.COMPILERLAB;
  if (!D) return;
  Object.values(D.lessons || {}).forEach((lesson) => {
    (lesson.steps || []).forEach((step) => {
      if (Array.isArray(step.metrics)) {
        const keyed = {};
        step.metrics.forEach((m) => { if (m && m.key != null) keyed[m.key] = m.value; });
        step.metrics = keyed;
      }
      if (Array.isArray(step.changes)) {
        step.changes = step.changes.map((c) => {
          if (!c || typeof c !== "object") return String(c);
          if (c.before && c.after) return c.label + ": " + c.before + " thành " + c.after;
          return String(c.label || c.after || "");
        });
      }
    });
  });
})();

(function () {
  const T = window.COMPILERLAB;
  T.practice.push(
    {
      id: "cc-practice-parse",
      module: "tu-vung-va-cu-phap",
      tag: "PARSE",
      title: "Thiếu một dấu chấm phẩy",
      scenario: "Trong buổi thực hành, nhóm bạn nộp một chương trình 10 câu lệnh lồng ba tầng. Trình biên dịch dừng ngay ở câu thứ tư vì thiếu dấu chấm phẩy sau lời gọi hàm. Một bạn đề nghị bỏ qua lỗi, cho parser chạy tiếp để kịp giờ; một bạn khác muốn sửa tay rồi chạy lại. Giảng viên nhắc rằng cây cú pháp chỉ dựng được khi toàn bộ câu lệnh hợp lệ, và thông báo lỗi cần chỉ đúng dòng, đúng cột để người sửa không mất thời gian dò. Nhóm cần chọn cách xử lý trước khi nộp bài.",
      metrics: [
        { label: "Câu lệnh", value: "10" },
        { label: "Độ sâu lồng", value: "3" },
        { label: "Lỗi cú pháp", value: "1" }
      ],
      options: [
        "Bỏ qua câu lỗi, dựng cây từ các câu còn lại",
        "Dừng ở lỗi, báo dòng và cột, sửa rồi dựng lại từ đầu",
        "Đổi sang ngôn ngữ khác để parser không gặp lỗi",
        "Tăng độ sâu lồng để parser chịu được lỗi"
      ],
      correct: 1,
      explain: "Parser không thể dựng một cây đúng khi còn câu lệnh sai cú pháp, nên phương án bỏ qua câu lỗi sẽ tạo cây thiếu nhánh và lan lỗi sang bước kiểm kiểu. Cách đúng là dừng, báo dòng và cột, sửa nguồn rồi dựng lại: <code>10</code> câu lệnh chỉ được chấp nhận khi cả 10 hợp lệ. Đổi ngôn ngữ không giải quyết lỗi cú pháp, chỉ đổi thứ cần viết đúng. Tăng độ sâu lồng làm cây sâu hơn, không sửa được dấu chấm phẩy thiếu. Thông báo lỗi tốt giúp người học sửa nhanh, đây cũng là tiêu chí chấm của bài."
    },
    {
      id: "cc-practice-runtime",
      module: "toi-uu-va-sinh-ma",
      tag: "RUNTIME",
      title: "Chi phí truy cập bộ nhớ",
      scenario: "Bài tập yêu cầu đo chi phí truy cập bộ nhớ của một vòng lặp chạy 1.000 lần. Trong vòng lặp có ba biến tạm không vừa thanh ghi nên bị đẩy ra bộ nhớ; mỗi lần truy cập tốn khoảng 4 chu kỳ nếu dữ liệu nằm trong cache L1, còn khoảng 100 chu kỳ nếu phải xuống RAM. Nhóm bạn ước lượng nhanh bằng cách nhân ba biến với 1.000 vòng, ra 3.000 lần truy cập, rồi nhân tiếp với 4 chu kỳ. Kết quả được dùng để quyết định có nên viết lại vòng lặp hay không.",
      metrics: [
        { label: "Vòng lặp", value: "1.000" },
        { label: "Biến tràn", value: "3" },
        { label: "Cache L1", value: "4 chu kỳ" }
      ],
      options: [
        "12.000 chu kỳ nếu trúng cache, có thể tới 300.000 chu kỳ nếu xuống RAM",
        "3.000 chu kỳ, vì mỗi biến chỉ truy cập một lần",
        "4.000 chu kỳ, vì chỉ tính một biến",
        "100.000 chu kỳ, vì mỗi vòng tốn 100 chu kỳ"
      ],
      correct: 0,
      explain: "Số lần truy cập là <code>3 × 1.000 = 3.000</code>. Trúng cache L1 tốn 12.000 chu kỳ; nếu trượt xuống RAM, cùng số lần truy cập tốn 300.000 chu kỳ, gấp 25 lần. Phương án 3.000 bỏ mất chi phí mỗi lần truy cập. Phương án 4.000 chỉ tính một biến trong ba biến tràn. Phương án 100.000 lấy 100 chu kỳ cho cả vòng lặp thay vì cho từng lần truy cập. Vì vậy câu trả lời đúng phải nêu cả hai mức và cho thấy vị trí dữ liệu quan trọng hơn số lệnh."
    }
  );
})();
