/* CompilerLab — dữ liệu phần 2: module Phân tích ngữ nghĩa */
window.COMPILERLAB = window.COMPILERLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  const T = window.COMPILERLAB;

  T.modules.push({
    id: "phan-tich-ngu-nghia",
    num: "02",
    tone: "mint",
    title: "Phân tích ngữ nghĩa",
    blurb: "Sau khi cây cú pháp đúng hình dạng, trình biên dịch vẫn phải trả lời: tên này là gì, kiểu nào, sống trong phạm vi nào. Bốn bài đi qua bảng ký hiệu, kiểm kiểu, phạm vi che khuất và mã trung gian ba địa chỉ, kèm số liệu đối chiếu với phòng mô phỏng.",
    lessons: ["symbol-table", "type-check", "scope", "ir"]
  });

  T.lessons["symbol-table"] = {
    id: "symbol-table",
    module: "phan-tich-ngu-nghia",
    title: "Bảng ký hiệu",
    shortTitle: "Bảng ký hiệu",
    subtitle: "Mỗi cái tên một dòng: kiểu, tầm vực và chỗ nằm trong bộ nhớ",
    blurb: "Bảng ký hiệu là cuốn sổ của trình biên dịch: mỗi biến, hàm, tham số được ghi một dòng kèm kiểu và tầm vực. Bài đi từ khai báo đầu tiên đến lúc phát hiện tên trùng, qua bảy khối và năm bước.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["bảng ký hiệu", "khai báo", "tầm vực", "tra cứu", "trùng tên"],
    metrics: [
      { key: "symbols", label: "Số ký hiệu", tone: "blue" },
      { key: "scope", label: "Tầm vực", tone: "mint" },
      { key: "types", label: "Kiểu", tone: "yellow" },
      { key: "verdict", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "source", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Mã nguồn", sub: "60 dòng, 6 hàm" },
      { id: "lexer", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Bộ tách token", sub: "đọc từng định danh" },
      { id: "symtab", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Bảng ký hiệu", sub: "tên, kiểu, tầm vực" },
      { id: "entry", type: "memory", x: 340, y: 195, w: 200, h: 70, label: "Một mục ký hiệu", sub: "count: int, dòng 4" },
      { id: "check", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Tra lại trước khi thêm", sub: "tìm trong cùng tầm vực" },
      { id: "err", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "Khai báo trùng", sub: "báo lỗi tại dòng 7" },
      { id: "later", type: "book", x: 625, y: 310, w: 200, h: 70, label: "Các chặng sau", sub: "kiểm kiểu, sinh IR" }
    ],
    edges: [
      { id: "source-lexer", from: "source", to: "lexer", kind: "request", label: "chuỗi ký tự" },
      { id: "lexer-symtab", from: "lexer", to: "symtab", kind: "data", label: "ghi mục mới" },
      { id: "symtab-entry", from: "symtab", to: "entry", kind: "data", label: "một dòng bảng" },
      { id: "entry-check", from: "entry", to: "check", kind: "control", label: "đối chiếu tên" },
      { id: "check-err", from: "check", to: "err", kind: "control", label: "trùng thì dừng" },
      { id: "check-symtab", from: "check", to: "symtab", kind: "data", label: "chấp nhận mục" },
      { id: "symtab-later", from: "symtab", to: "later", kind: "data", label: "bảng đã đầy đủ" }
    ],
    learn: [
      "Bảng ký hiệu lưu <strong>tên, kiểu, tầm vực</strong> và vị trí cấp phát của mọi định danh.",
      "Tra cứu trên bảng băm trung bình <code>O(1)</code>, nhưng in báo cáo vẫn cần duyệt cả bảng.",
      "Hai khai báo cùng tên trong cùng một tầm vực là lỗi, khác với che khuất ở tầng trong.",
      "Bảng còn là cầu nối: kiểm kiểu đọc kiểu từ đây, sinh mã đọc vị trí từ đây."
    ],
    steps: [
      {
        short: "Ghi tên",
        type: "concept",
        title: "Mở cuốn sổ trước khi hiểu nghĩa",
        body: "Mọi thứ có tên trong chương trình đều được ghi vào một cuốn sổ chung gọi là bảng ký hiệu. Gặp dòng <code>int count = 0;</code>, bộ phân tích tạo một mục gồm tên <code>count</code>, kiểu <code>int</code>, tầm vực hiện tại và vị trí cấp phát. Chương trình mẫu của bài dài 60 dòng, có 6 hàm và tổng cộng 42 mục như vậy. Bảng thường cài bằng bảng băm, nên tra một tên mất trung bình O(1), còn duyệt tuần tự để in báo cáo mất O(n). Không có cuốn sổ này, trình biên dịch không phân biệt được biến với hàm, cũng không biết mỗi tên chiếm bao nhiêu byte.",
        focus: ["source", "lexer", "symtab"],
        edges: ["source-lexer", "lexer-symtab"],
        metrics: { symbols: "1", scope: "toàn cục", types: "int", verdict: "mục đầu" },
        changes: ["Cuốn sổ trống được cấp phát", "Mục count xuất hiện đầu tiên"],
        note: "Bảng ký hiệu ra đời ngay sau khi tách token, trước mọi phép kiểm nghĩa."
      },
      {
        short: "Thêm mục",
        type: "flow",
        title: "Mỗi khai báo một dòng",
        body: "Cứ mỗi khai báo, bảng nhận thêm một dòng. Với 6 hàm, 12 tham số và 24 biến cục bộ, chương trình mẫu chạm mốc 42 mục. Bộ phân tích không chỉ ghi tên mà còn ghi kiểu, tầm vực và độ lệch so với con trỏ khung, nhờ vậy chặng sinh mã về sau chỉ cần cộng độ lệch là ra địa chỉ. Các mục được nhóm theo tầm vực, mỗi tầm vực một khung riêng, giống như mỗi lớp học có một tờ danh sách riêng thay vì dùng chung một tờ cho cả trường. Ghi đúng ngay từ đầu rẻ hơn nhiều so với sửa bảng sau khi đã kiểm kiểu.",
        focus: ["symtab", "entry", "lexer"],
        edges: ["lexer-symtab", "symtab-entry", "check-symtab"],
        metrics: { symbols: "42", scope: "3 tầng", types: "int, float", verdict: "đã ghi" },
        changes: ["Bảng có đủ 42 mục", "Mỗi tầm vực một khung riêng"],
        note: "Độ lệch khung được tính ngay lúc thêm mục, không đợi đến lúc sinh mã."
      },
      {
        short: "Tra cứu",
        type: "detail",
        title: "Tên được dùng lại về sau",
        body: "Khi gặp <code>count = count + 1;</code>, trình biên dịch tra bảng hai lần và nhận về cùng một mục kiểu <code>int</code>. Phép cộng chỉ hợp lệ vì cả hai vế cùng kiểu số nguyên; nếu một vế là <code>float</code>, bộ kiểm kiểu sẽ chèn một phép chuyển đổi. Mỗi lần tra, chương trình mẫu tốn vài chục nano giây, nhưng tổng số lần tra trên 60 dòng đã lên tới 118 lượt, nên chọn cấu trúc dữ liệu có ảnh hưởng thật. Bảng còn cho biết tên đó khai báo ở dòng nào, rất tiện khi báo lỗi kèm vị trí.",
        focus: ["entry", "check", "symtab"],
        edges: ["entry-check", "check-symtab", "symtab-later"],
        metrics: { symbols: "42", scope: "khối hiện tại", types: "int", verdict: "khớp kiểu" },
        changes: ["118 lượt tra cứu được phục vụ", "Kiểu int được xác nhận cho cả hai vế"],
        note: "Tra cứu trả về mục gần nhất còn hiệu lực, không phải mục đầu tiên tìm thấy."
      },
      {
        short: "Trùng tên",
        type: "pitfall",
        title: "Dòng 7 khai báo lại count",
        body: "Chương trình mẫu khai báo <code>int count = 0;</code> ở dòng 4 rồi lại viết <code>int count = 1;</code> ngay dòng 7, vẫn trong thân hàm <code>main</code>. Trước khi thêm mục thứ hai, bộ phân tích tra bảng trong đúng tầm vực đó, thấy tên đã tồn tại và dừng với lỗi khai báo trùng. Nếu bỏ qua phép kiểm này, hai mục cùng tên sẽ cùng tồn tại, chặng sinh mã không biết cấp phát cho mục nào và chương trình chạy sai một cách âm thầm. Hãy phân biệt: trùng tên trong cùng tầm vực là lỗi, còn khai báo lại ở tầng trong là che khuất hợp lệ, sẽ học ở bài ba.",
        focus: ["check", "err", "entry"],
        edges: ["entry-check", "check-err"],
        metrics: { symbols: "41", scope: "thân hàm main", types: "int", verdict: "báo lỗi" },
        changes: ["Mục thứ hai bị từ chối", "Lỗi trỏ đúng dòng 7"],
        note: "Chỉ tra trong cùng tầm vực, nếu không sẽ báo nhầm mọi biến trùng tên ở tầng ngoài."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Cuốn sổ nối các chặng",
        body: "Tổng kết: bảng ký hiệu ghi 42 mục cho chương trình 60 dòng, mỗi mục gồm tên, kiểu, tầm vực và độ lệch khung. Bảng được tra 118 lượt trong toàn chương trình, trung bình O(1) mỗi lượt, và chặn được khai báo trùng ở dòng 7. Ba giá trị của bài nằm ở chỗ: nó là nguồn sự thật về kiểu cho bước kiểm kiểu, là bản đồ vị trí cho bước sinh mã, và là nơi phát hiện sớm những lỗi mà cú pháp không thấy. Bài tiếp theo dùng chính cuốn sổ này để kiểm tra kiểu của từng biểu thức.",
        focus: "all",
        edges: "all",
        metrics: { symbols: "42", scope: "3 tầng", types: "khớp", verdict: "đạt" },
        changes: ["Đủ vòng đời từ khai báo đến sinh mã", "Sẵn sàng sang bài kiểm kiểu"],
        note: "Nhớ ba trường bắt buộc: tên, kiểu, tầm vực; thiếu trường nào cũng phải sửa bảng."
      }
    ]
  };

  T.lessons["type-check"] = {
    id: "type-check",
    module: "phan-tich-ngu-nghia",
    title: "Kiểm kiểu",
    shortTitle: "Kiểm kiểu",
    subtitle: "Gán kiểu cho từng nút và bắt lỗi trước khi chạy",
    blurb: "Kiểm kiểu đi ngược cây cú pháp để gán kiểu cho mọi biểu thức và đối chiếu với luật của từng phép toán. Bài cho thấy một lỗi cộng chuỗi với số bị bắt ở đâu, và vì sao bắt sớm lại rẻ hơn nhiều.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["kiểm kiểu", "suy kiểu", "ép kiểu", "luật kiểu", "lỗi tĩnh"],
    metrics: [
      { key: "exprs", label: "Biểu thức", tone: "blue" },
      { key: "errors", label: "Lỗi kiểu", tone: "coral" },
      { key: "rules", label: "Luật kiểu", tone: "yellow" },
      { key: "verdict", label: "Kết luận", tone: "mint" }
    ],
    nodes: [
      { id: "expr", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Biểu thức nguồn", sub: "price * qty + fee" },
      { id: "infer", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Suy kiểu", sub: "gán kiểu cho từng nút" },
      { id: "table", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Bảng luật kiểu", sub: "12 luật cơ bản" },
      { id: "ast", type: "layers", x: 340, y: 195, w: 200, h: 70, label: "Cây biểu thức", sub: "gốc là phép cộng" },
      { id: "join", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Hợp nhất hai nhánh", sub: "int gặp float" },
      { id: "cast", type: "bolt", x: 625, y: 310, w: 200, h: 70, label: "Chèn ép kiểu", sub: "int sang float" },
      { id: "err", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "Lỗi kiểu", sub: "cộng chuỗi với số" }
    ],
    edges: [
      { id: "expr-infer", from: "expr", to: "infer", kind: "request", label: "biểu thức" },
      { id: "infer-table", from: "infer", to: "table", kind: "data", label: "hỏi luật" },
      { id: "infer-ast", from: "infer", to: "ast", kind: "data", label: "duyệt từ lá lên" },
      { id: "ast-join", from: "ast", to: "join", kind: "data", label: "kiểu hai nhánh" },
      { id: "join-cast", from: "join", to: "cast", kind: "control", label: "khác kiểu" },
      { id: "join-err", from: "join", to: "err", kind: "control", label: "không hợp lệ" },
      { id: "cast-table", from: "cast", to: "table", kind: "request", label: "luật chuyển đổi" }
    ],
    learn: [
      "Kiểm kiểu duyệt cây <strong>từ lá lên gốc</strong>, mỗi nút nhận một kiểu xác định.",
      "Luật kiểu phát biểu dạng <code>int + int = int</code>, không có ngoại lệ ngầm.",
      "Hai nhánh if khác kiểu phải <strong>hợp nhất</strong> hoặc chèn ép kiểu tường minh.",
      "Lỗi kiểu bắt ở biên dịch rẻ hơn lỗi bắt lúc chạy, vì không tốn một lần chạy thử."
    ],
    steps: [
      {
        short: "Kiểu là gì",
        type: "concept",
        title: "Mỗi giá trị một nhãn",
        body: "Kiểu là tập hợp giá trị mà một biến được phép nhận, cộng với các phép toán hợp lệ trên nó. Trong chương trình mẫu, <code>price</code> và <code>qty</code> là <code>int</code>, còn <code>fee</code> là <code>float</code>. Nhãn kiểu quyết định cách sinh mã: cộng hai số nguyên khác cộng hai số thực ở cả lệnh máy lẫn độ rộng thanh ghi. Kiểm kiểu không chứng minh chương trình đúng, nó chỉ bảo đảm mọi phép toán nhận đúng loại toán hạng. Chương trình mẫu có 18 biểu thức và 12 luật kiểu, đủ để thấy hệ thống nhỏ nhưng chặt. Không có nhãn này, máy phải đoán và thường đoán sai.",
        focus: ["expr", "table"],
        edges: ["expr-infer", "infer-table"],
        metrics: { exprs: "18", errors: "0", rules: "12", verdict: "đang suy" },
        changes: ["Ba biến được gắn nhãn kiểu", "Bảng 12 luật được nạp"],
        note: "Kiểu thuộc về biểu thức chứ không thuộc về tên biến; cùng một tên có thể mang kiểu khác ở tầng trong."
      },
      {
        short: "Suy kiểu",
        type: "flow",
        title: "Đi từ lá lên gốc",
        body: "Với biểu thức <code>price * qty + fee</code>, bộ kiểm đi từ các lá <code>price</code>, <code>qty</code>, <code>fee</code> ngược lên gốc. Nút nhân nhận hai toán hạng <code>int</code> nên trả về <code>int</code>; nút cộng nhận <code>int</code> và <code>float</code>. Mỗi nút chỉ cần kiểu của con trực tiếp, nhờ vậy toàn bộ 18 biểu thức được xử lý trong một lượt duyệt cây, không phải quay lại. Kết quả được ghi vào chính nút, nên chặng sinh mã đọc lại không cần tính lần hai. Cách làm này gọi là suy kiểu cục bộ, đơn giản nhưng bắt được phần lớn lỗi thường gặp.",
        focus: ["infer", "ast", "table"],
        edges: ["infer-ast", "infer-table", "expr-infer"],
        metrics: { exprs: "18", errors: "0", rules: "12", verdict: "int gặp float" },
        changes: ["Kiểu ghi vào từng nút cây", "Toàn bộ 18 biểu thức xong trong một lượt"],
        note: "Duyệt sau (post-order) là thứ tự tự nhiên vì con phải có kiểu trước cha."
      },
      {
        short: "Hợp nhất",
        type: "detail",
        title: "Hai nhánh if khác kiểu",
        body: "Khi một biểu thức <code>if</code> trả <code>int</code> ở nhánh đúng và <code>float</code> ở nhánh sai, kết quả phải có một kiểu chung. Bộ kiểm chọn kiểu rộng hơn, ở đây là <code>float</code>, rồi chèn phép chuyển đổi ở nhánh còn lại. Phép chuyển từ <code>int</code> sang <code>float</code> an toàn vì không mất phần lẻ; chiều ngược lại cần làm tròn và thường bị cấm ngầm. Trong chương trình mẫu có 5 điểm hợp nhất như vậy, tất cả đều chọn <code>float</code>. Nếu hai nhánh là <code>int</code> và <code>string</code>, không có kiểu chung hợp lý, bộ kiểm dừng và báo lỗi thay vì đoán bừa.",
        focus: ["join", "cast", "ast"],
        edges: ["ast-join", "join-cast", "cast-table"],
        metrics: { exprs: "18", errors: "0", rules: "12", verdict: "chọn float" },
        changes: ["5 điểm hợp nhất được xử lý", "Một phép ép kiểu được chèn"],
        note: "Hợp nhất luôn chọn kiểu rộng hơn, không bao giờ làm mất thông tin âm thầm."
      },
      {
        short: "Lỗi kiểu",
        type: "pitfall",
        title: "Dòng 12: chuỗi cộng với số",
        body: "Chương trình mẫu có dòng <code>total = ten + 5;</code> với <code>ten</code> kiểu <code>string</code>. Luật cộng chỉ định nghĩa <code>int + int</code>, <code>float + float</code> và <code>string + string</code>, nên cặp <code>string</code> với <code>int</code> không khớp luật nào. Bộ kiểm báo lỗi ngay tại dòng 12 và dừng trước khi sinh mã, tổng cộng 1 lỗi trên 18 biểu thức. Nếu ngôn ngữ cho phép tự chuyển, <code>5</code> thành <code>\"5\"</code> và kết quả là chuỗi <code>\"125\"</code> thay vì 17, một lỗi rất khó lần. Bắt ở biên dịch tốn vài mili giây, bắt ở khách hàng tốn vài giờ.",
        focus: ["join", "err", "table"],
        edges: ["join-err", "infer-table"],
        metrics: { exprs: "18", errors: "1", rules: "12", verdict: "dừng, báo lỗi" },
        changes: ["Lỗi kiểu tại dòng 12", "Chặng sinh mã chưa chạy"],
        note: "Kiểm kiểu là lá chắn rẻ nhất: nó chạy một lần cho mọi lần chạy về sau."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Bắt lỗi khi còn rẻ",
        body: "Tổng kết: bộ kiểm duyệt cây một lượt, gán kiểu cho 18 biểu thức theo 12 luật, xử lý 5 điểm hợp nhất và bắt đúng 1 lỗi kiểu ở dòng 12. Hai ý cần mang đi: kiểu đi từ lá lên gốc nên mỗi nút chỉ cần kiểu của con trực tiếp, và mọi chuyển đổi phải tường minh hoặc theo luật rộng hơn. Hệ thống kiểu không bảo đảm chương trình làm đúng việc kinh doanh, nó chỉ bảo đảm phép toán không nhận nhầm loại dữ liệu. Bài tiếp theo đi vào câu hỏi mà bảng ký hiệu để ngỏ: cùng một tên xuất hiện ở nhiều tầng thì tầng nào thắng.",
        focus: "all",
        edges: "all",
        metrics: { exprs: "18", errors: "1", rules: "12", verdict: "đạt" },
        changes: ["Đủ vòng suy kiểu, hợp nhất và báo lỗi", "Sẵn sàng sang bài phạm vi"],
        note: "Nhớ tỉ lệ: 1 lỗi kiểu trên 18 biểu thức là mức bình thường của mã đang viết."
      }
    ]
  };

  T.lessons["scope"] = {
    id: "scope",
    module: "phan-tich-ngu-nghia",
    title: "Phạm vi và che khuất",
    shortTitle: "Phạm vi",
    subtitle: "Ba tầng lồng nhau và ai thắng khi hai tầng cùng tên",
    blurb: "Phạm vi quyết định một cái tên sống ở đâu và bị che khi nào. Bài dựng ba tầng toàn cục, hàm, khối, đi theo một lần tra cứu từ trong ra ngoài rồi cố tình dùng biến đã hết hạn.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["phạm vi", "che khuất", "khối lệnh", "tra cứu", "vòng đời biến"],
    metrics: [
      { key: "depth", label: "Số tầng", tone: "blue" },
      { key: "shadow", label: "Tên bị che", tone: "yellow" },
      { key: "lookup", label: "Bước tra cứu", tone: "mint" },
      { key: "verdict", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "global", type: "grid", x: 55, y: 80, w: 200, h: 70, label: "Phạm vi toàn cục", sub: "biến tax = 0,08" },
      { id: "func", type: "layers", x: 340, y: 80, w: 200, h: 70, label: "Phạm vi hàm", sub: "tham số count" },
      { id: "block", type: "page", x: 625, y: 80, w: 200, h: 70, label: "Phạm vi khối", sub: "for lồng trong hàm" },
      { id: "inner", type: "memory", x: 340, y: 195, w: 200, h: 70, label: "Tên bị che", sub: "count cục bộ = 0" },
      { id: "lookup", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Tra từ trong ra", sub: "dừng ở tầng gần nhất" },
      { id: "err", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "Dùng ngoài phạm vi", sub: "i đã hết hiệu lực" },
      { id: "rule", type: "book", x: 625, y: 310, w: 200, h: 70, label: "Quy tắc khai báo", sub: "khai báo trước khi dùng" }
    ],
    edges: [
      { id: "global-func", from: "global", to: "func", kind: "data", label: "lồng vào" },
      { id: "func-block", from: "func", to: "block", kind: "data", label: "lồng vào" },
      { id: "block-inner", from: "block", to: "inner", kind: "control", label: "khai báo lại" },
      { id: "inner-lookup", from: "inner", to: "lookup", kind: "data", label: "ưu tiên tầng trong" },
      { id: "lookup-block", from: "lookup", to: "block", kind: "control", label: "tìm ngược ra" },
      { id: "lookup-err", from: "lookup", to: "err", kind: "control", label: "không thấy tên" },
      { id: "func-rule", from: "func", to: "rule", kind: "control", label: "kiểm trước dùng" }
    ],
    learn: [
      "Phạm vi lồng như hộp giấy: tầng trong thấy tầng ngoài, chiều ngược lại thì không.",
      "Tầng trong khai báo lại cùng tên là <strong>che khuất</strong> hợp lệ, không phải lỗi.",
      "Tra cứu đi từ khung trong cùng ra ngoài và dừng ngay ở lần khớp đầu tiên, tối đa <code>3</code> bước ở bài này.",
      "Biến khai báo trong khối <code>for</code> chết khi khối đóng, dùng lại là lỗi tên chưa khai báo."
    ],
    steps: [
      {
        short: "Ba tầng",
        type: "concept",
        title: "Phạm vi lồng như hộp giấy",
        body: "Mỗi khai báo sống trong một phạm vi, và các phạm vi lồng nhau như hộp giấy. Chương trình mẫu có đúng 3 tầng: tầng toàn cục khai báo <code>tax = 0,08</code>, tầng hàm nhận tham số <code>count</code>, tầng khối chứa vòng lặp <code>for</code>. Tên ở tầng trong nhìn thấy được tên ở tầng ngoài, nhưng chiều ngược lại không đúng. Khi khối lệnh kết thúc, mọi tên khai báo bên trong biến mất khỏi tầm nhìn. Chính vì thế phạm vi được cài như một ngăn xếp: vào khối thì đẩy khung mới, ra khỏi khối thì lấy khung đó ra. Ba tầng là con số nhỏ nhưng đủ sinh ra gần hết các lỗi tên mà người mới hay gặp.",
        focus: ["global", "func", "block"],
        edges: ["global-func", "func-block"],
        metrics: { depth: "3", shadow: "0", lookup: "1 bước", verdict: "dựng ngăn xếp" },
        changes: ["Ba khung phạm vi được đẩy lên", "Biến tax nằm ở tầng ngoài cùng"],
        note: "Vào khối thì đẩy khung, ra khối thì lấy ra: ngăn xếp chính là mô hình của phạm vi."
      },
      {
        short: "Tra cứu",
        type: "flow",
        title: "Đi từ trong ra ngoài",
        body: "Khi gặp tên <code>tax</code> bên trong vòng lặp, bộ phân tích tra ngăn xếp từ khung trong cùng ra ngoài. Nó dừng ngay ở khung đầu tiên có tên đó, tối đa 3 bước với chương trình ba tầng. Nếu không khung nào có, đó là lỗi tên chưa khai báo. Cách tra này giải thích vì sao biến toàn cục vẫn dùng được ở mọi nơi, còn biến trong khối thì không. Chi phí tra cứu tỉ lệ với độ sâu phạm vi, không tỉ lệ với số biến, nên thêm bao nhiêu biến cũng không chậm thêm. Đổi lại, người đọc phải tự nhớ mình đang đứng ở tầng nào mới biết tên đang trỏ tới khai báo nào.",
        focus: ["lookup", "global", "func", "block"],
        edges: ["lookup-block", "global-func", "func-block"],
        metrics: { depth: "3", shadow: "0", lookup: "3 bước", verdict: "thấy tax" },
        changes: ["tax được tìm thấy ở tầng ngoài cùng", "Mất 3 bước tra cứu"],
        note: "Tra cứu dừng ở lần khớp đầu tiên, nên thứ tự khung quan trọng hơn số lượng khung."
      },
      {
        short: "Che khuất",
        type: "detail",
        title: "Cùng tên, hai biến khác nhau",
        body: "Che khuất xảy ra khi tầng trong khai báo lại một tên đã có ở tầng ngoài. Chương trình mẫu có tham số <code>count</code> ở tầng hàm, rồi trong khối lệnh lại viết <code>int count = 0;</code>. Từ dòng đó đến cuối khối, mọi chữ <code>count</code> trỏ về biến cục bộ; tham số <code>count</code> vẫn còn nhưng bị che. Khi ra khỏi khối, cái tên hiện lại giá trị cũ, đúng như chưa từng có chuyện gì. Đây là cơ chế hợp lệ chứ không phải lỗi, song nó là nguồn gốc của rất nhiều hiểu nhầm. Mẹo thực dụng: đặt tên khác nhau cho các tầng, hoặc bật cảnh báo che khuất trong trình biên dịch.",
        focus: ["block", "inner", "lookup"],
        edges: ["block-inner", "inner-lookup"],
        metrics: { depth: "3", shadow: "1", lookup: "1 bước", verdict: "cục bộ thắng" },
        changes: ["count cục bộ che count tham số", "Giá trị cũ trở lại khi đóng khối"],
        note: "Che khuất không xóa biến ngoài, nó chỉ tạm thời giấu tên đi trong một đoạn."
      },
      {
        short: "Hết hạn",
        type: "pitfall",
        title: "Biến đếm sống quá ngắn",
        body: "Lỗi kinh điển là khai báo biến đếm ngay trong câu lệnh <code>for</code> rồi dùng lại sau vòng lặp. Trong chương trình mẫu, biến <code>i</code> chỉ sống trong khối của vòng lặp; dòng 9 dùng <code>i</code> để in kết quả nằm ngoài khối đó, nên bộ phân tích không tìm thấy tên và báo lỗi. Ngôn ngữ kiểu cũ cho phép việc này, ngôn ngữ hiện đại thì không, và đó là thay đổi có chủ đích: phạm vi hẹp làm mã dễ đọc hơn. Cùng một lỗi còn xuất hiện khi tham số trùng tên biến toàn cục, hoặc khi khối lồng quá ba tầng khiến người đọc mất dấu tầng hiện tại.",
        focus: ["err", "lookup", "rule"],
        edges: ["lookup-err", "func-rule"],
        metrics: { depth: "3", shadow: "1", lookup: "0 bước", verdict: "báo lỗi dòng 9" },
        changes: ["Tên i không còn trong ngăn xếp", "Biên dịch dừng tại dòng 9"],
        note: "Phạm vi hẹp là tính năng, không phải phiền toái: nó chặn đúng loại lỗi này."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Ai thắng khi hai tầng cùng tên",
        body: "Tổng kết: chương trình mẫu có 3 tầng phạm vi, một tên bị che là <code>count</code>, và mỗi lần tra cứu tốn tối đa 3 bước ngăn xếp. Tầng trong luôn thắng khi trùng tên, nhưng chỉ trong đoạn còn hiệu lực; hết khối thì tầng ngoài hiện lại. Hai lỗi cần nhớ: dùng biến sau khi khối đóng, và vô tình che một tên quan trọng khiến giá trị cũ không bao giờ được cập nhật. Bài tiếp theo chuyển từ câu hỏi tên nghĩa là gì sang câu hỏi mã máy sẽ trông ra sao, qua dạng trung gian ba địa chỉ.",
        focus: "all",
        edges: "all",
        metrics: { depth: "3", shadow: "1", lookup: "3 bước", verdict: "đạt" },
        changes: ["Đủ vòng đời mở và đóng ba khung", "Sẵn sàng sang bài mã trung gian"],
        note: "Nhớ một câu: tầng trong thắng, nhưng chỉ thắng trong khối của nó."
      }
    ]
  };

  T.lessons["ir"] = {
    id: "ir",
    module: "phan-tich-ngu-nghia",
    title: "Mã trung gian ba địa chỉ",
    shortTitle: "Mã trung gian",
    subtitle: "Tách biểu thức thành lệnh đơn giản rồi tối ưu trên đó",
    blurb: "Mã trung gian là điểm hẹn giữa ngôn ngữ nguồn và kiến trúc đích. Bài hạ một biểu thức thành bốn lệnh ba địa chỉ, rồi đo hai lượt tối ưu trên 200 lệnh để thấy khi nào tốc độ tăng là đáng kể.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["mã trung gian", "ba địa chỉ", "gấp hằng", "mã chết", "tối ưu"],
    metrics: [
      { key: "ir", label: "Lệnh IR", tone: "blue" },
      { key: "fold", label: "Gấp hằng", tone: "yellow" },
      { key: "dead", label: "Mã chết", tone: "coral" },
      { key: "speed", label: "Tốc độ", tone: "mint" }
    ],
    nodes: [
      { id: "src", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Biểu thức nguồn", sub: "x = 4 * 5 + y * 2" },
      { id: "builder", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Sinh mã ba địa chỉ", sub: "mỗi lệnh một phép toán" },
      { id: "temp", type: "memory", x: 625, y: 80, w: 200, h: 70, label: "Biến tạm t1, t2, t3", sub: "mỗi kết quả một biến" },
      { id: "list", type: "grid", x: 340, y: 195, w: 200, h: 70, label: "Danh sách lệnh IR", sub: "200 lệnh ban đầu" },
      { id: "fold", type: "bolt", x: 55, y: 310, w: 200, h: 70, label: "Gấp hằng", sub: "4 * 5 thành 20" },
      { id: "dead", type: "shield", x: 625, y: 310, w: 200, h: 70, label: "Bỏ mã chết", sub: "20 lệnh không ai đọc" },
      { id: "speed", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Đo tốc độ", sub: "200 chia 80 được 2,5" }
    ],
    edges: [
      { id: "src-builder", from: "src", to: "builder", kind: "request", label: "cây cú pháp" },
      { id: "builder-temp", from: "builder", to: "temp", kind: "data", label: "cấp biến tạm" },
      { id: "temp-list", from: "temp", to: "list", kind: "data", label: "ba địa chỉ" },
      { id: "list-fold", from: "list", to: "fold", kind: "data", label: "200 lệnh" },
      { id: "fold-dead", from: "fold", to: "dead", kind: "data", label: "còn 100 lệnh" },
      { id: "dead-speed", from: "dead", to: "speed", kind: "data", label: "còn 80 lệnh" },
      { id: "speed-list", from: "speed", to: "list", kind: "control", label: "đo lại sau tối ưu" }
    ],
    learn: [
      "Ba địa chỉ nghĩa là mỗi lệnh có tối đa <strong>một phép toán</strong> và ba vị trí: hai nguồn, một đích.",
      "Mã trung gian tách ngôn ngữ nguồn khỏi kiến trúc đích nên mỗi phép tối ưu chỉ viết một lần.",
      "Trên 200 lệnh, gấp hằng <code>50%</code> rồi bỏ mã chết <code>20%</code> còn 80 lệnh, nhanh 2,5 lần.",
      "Từ <code>1,5</code> lần trở lên mới coi là đáng bật tối ưu; dưới ngưỡng đó chi phí lớn hơn phần thu."
    ],
    steps: [
      {
        short: "Vì sao cần",
        type: "concept",
        title: "Điểm hẹn giữa hai thế giới",
        body: "Một trình biên dịch phải phục vụ nhiều ngôn ngữ nguồn và nhiều kiến trúc đích. Nếu viết riêng bộ sinh mã cho từng cặp, số lượng bộ sinh mã tăng theo tích hai phía; chèn một dạng trung gian thì chỉ cần một bộ dịch xuống và một bộ sinh mã cho mỗi đích. Dạng ba địa chỉ là lựa chọn phổ biến: mỗi lệnh có tối đa một phép toán và ba vị trí, ví dụ <code>t1 = 4 * 5</code>. Nhờ dạng chuẩn này, các phép tối ưu chỉ cần viết một lần. Chương trình mẫu <code>x = 4 * 5 + y * 2</code> sinh ra 200 lệnh IR sau khi hạ các cấu trúc điều khiển.",
        focus: ["src", "builder"],
        edges: ["src-builder"],
        metrics: { ir: "200", fold: "0%", dead: "0%", speed: "1,0x" },
        changes: ["Chọn dạng ba địa chỉ", "200 lệnh IR được đặt làm mốc"],
        note: "Một dạng trung gian tốt phải đủ đơn giản để tối ưu và đủ giàu để không mất nghĩa."
      },
      {
        short: "Hạ lệnh",
        type: "flow",
        title: "Một biểu thức, bốn lệnh",
        body: "Biểu thức <code>x = 4 * 5 + y * 2</code> không thể thành một lệnh máy vì có hai phép toán. Bộ sinh mã tách thành bốn lệnh: <code>t1 = 4 * 5</code>, <code>t2 = y * 2</code>, <code>t3 = t1 + t2</code>, rồi <code>x = t3</code>. Mỗi biến tạm <code>t1</code>, <code>t2</code>, <code>t3</code> chỉ giữ một giá trị, nên thứ tự lệnh nói rõ phép nào làm trước. Toàn chương trình mẫu cần 200 lệnh IR, gồm cả lệnh nhảy và nhãn cho vòng lặp. Dạng này dài dòng hơn mã nguồn nhưng cực dễ phân tích: chỉ cần nhìn một lệnh là biết nó đọc gì, ghi gì, không phải suy luận trong biểu thức lồng nhau.",
        focus: ["builder", "temp", "list"],
        edges: ["builder-temp", "temp-list"],
        metrics: { ir: "200", fold: "0%", dead: "0%", speed: "1,0x" },
        changes: ["Biểu thức thành bốn lệnh", "Cấp ba biến tạm t1, t2, t3"],
        note: "Tên tạm chỉ sống trong một khoảng ngắn, nên bộ cấp phát thanh ghi rất thích dạng này."
      },
      {
        short: "Gấp hằng",
        type: "detail",
        title: "Bỏ nửa số lệnh tính toán",
        body: "Gấp hằng thay một phép tính mà cả hai vế đều là hằng bằng kết quả đã tính sẵn. Lệnh <code>t1 = 4 * 5</code> biến thành <code>t1 = 20</code>, và nếu sau đó chỉ dùng một lần, trình biên dịch thay thẳng <code>20</code> vào chỗ dùng. Trên chương trình mẫu, bước này bỏ được 50% số lệnh: 200 còn 100, tức nhanh gấp 2 lần nếu mọi lệnh tốn như nhau. Phép biến đổi an toàn vì kết quả không phụ thuộc dữ liệu chạy, chỉ cần chú ý phép chia cho 0 và tràn số. Đây là tối ưu rẻ nhất trong danh sách, vì nó không cần phân tích luồng dữ liệu phức tạp.",
        focus: ["list", "fold", "temp"],
        edges: ["list-fold", "temp-list"],
        metrics: { ir: "100", fold: "50%", dead: "0%", speed: "2,0x" },
        changes: ["200 lệnh giảm còn 100", "t1 thành hằng 20"],
        note: "Gấp hằng chỉ đúng khi cả hai vế là hằng và phép toán không có tác dụng phụ."
      },
      {
        short: "Mã chết",
        type: "pitfall",
        title: "Tối ưu vừa phải mới đáng",
        body: "Bỏ mã chết xóa những lệnh mà kết quả không ai đọc, ví dụ biến tạm gán rồi bỏ. Trên 100 lệnh còn lại sau gấp hằng, bước này bỏ 20%, để lại 80 lệnh; so với 200 lệnh gốc, chương trình nhanh 2,5 lần. Nhưng không phải cứ tối ưu là đáng: với 120 lệnh, gấp hằng 40% và bỏ mã chết 25%, còn 54 lệnh và tốc độ tăng 2,2 lần, vẫn trên ngưỡng. Ngược lại, một cấu hình chỉ giảm 10% cho ra 1,1 lần, dưới ngưỡng 1,5 lần nên không đáng bật. Quy tắc thực dụng: từ 1,5 lần trở lên mới coi là có lợi, dưới mức đó chi phí biên dịch và rủi ro lỗi lớn hơn phần thu.",
        focus: ["fold", "dead", "speed"],
        edges: ["fold-dead", "dead-speed"],
        metrics: { ir: "80", fold: "50%", dead: "20%", speed: "2,5x" },
        changes: ["100 lệnh giảm còn 80", "Tốc độ chạm 2,5 lần"],
        note: "Con số 120 lệnh còn 54 và 2,2 lần là ví dụ thứ hai, đừng trộn với cặp 200 và 80."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Đo bằng lệnh, kết luận bằng ngưỡng",
        body: "Tổng kết: từ 200 lệnh IR, gấp hằng 50% đưa về 100, bỏ mã chết 20% đưa về 80, tương đương nhanh 2,5 lần. Ví dụ thứ hai gọn hơn: 120 lệnh, gấp hằng 40%, bỏ mã chết 25%, còn 54 lệnh và nhanh 2,2 lần. Cả hai đều vượt ngưỡng 1,5 lần nên đáng bật. Ngược lại, cấu hình chỉ giảm 10% cho 1,1 lần, không đáng. Ba điều cần mang đi: mỗi lệnh ba địa chỉ chỉ làm một việc, tối ưu chạy trên dạng chuẩn chứ không trên cây nguồn, và mọi kết luận phải kèm con số. Chặng tiếp theo dùng danh sách lệnh này để sinh mã máy.",
        focus: "all",
        edges: "all",
        metrics: { ir: "80", fold: "50%", dead: "20%", speed: "2,5x" },
        changes: ["Đủ hai lượt tối ưu trên cùng danh sách", "Sẵn sàng sang chặng sinh mã"],
        note: "Nhớ hai bộ số: 200 xuống 80 là 2,5 lần; 120 xuống 54 là 2,2 lần."
      }
    ]
  };

  T.practice.push(
    {
      id: "cc-typecall",
      module: "phan-tich-ngu-nghia",
      tag: "TYPECHECK",
      title: "Gọi hàm sai kiểu tham số",
      scenario: "Trong một cửa hàng trực tuyến, hàm tính giảm giá được khai báo với hai tham số kiểu số nguyên: tổng tiền và phần trăm giảm. Một lập trình viên đọc tổng tiền từ ô nhập của khách, nhận về chuỗi, rồi gọi thẳng hàm mà không chuyển đổi. Trình biên dịch báo một lỗi kiểu tại đúng dòng gọi hàm, trước khi chạy bất kỳ đơn hàng nào. Nhóm tranh luận ba cách: bỏ qua vì cho rằng ngôn ngữ tự chuyển, ép kiểu tại chỗ gọi, hoặc đổi kiểu tham số thành chuỗi. Câu hỏi là cách nào giữ được kiểm tra kiểu mà vẫn chạy đúng.",
      metrics: [
        { label: "Lỗi bắt được", value: "1" },
        { label: "Thời điểm", value: "biên dịch" },
        { label: "Chi phí sửa", value: "thấp" }
      ],
      options: [
        "Bỏ qua lỗi, để ngôn ngữ tự chuyển chuỗi thành số lúc chạy",
        "Ép kiểu tường minh tại chỗ gọi, giữ nguyên kiểu số của hàm",
        "Đổi cả hai tham số của hàm sang kiểu chuỗi",
        "Tắt bước kiểm kiểu cho tệp này để biên dịch được"
      ],
      correct: 1,
      explain: "Đáp án đúng là ép kiểu tường minh tại chỗ gọi, ví dụ <code>giam(parseInt(o.value), 10)</code>, vì hàm giữ nguyên hợp đồng số nguyên và chỗ gọi tự chịu trách nhiệm chuyển dữ liệu từ giao diện. Cách này vẫn để bộ kiểm kiểu làm việc: sau khi ép, hai tham số đúng kiểu và mọi phép tính bên trong hàm an toàn. Bỏ qua lỗi là sai vì ngôn ngữ tĩnh không tự chuyển ngầm; nếu có chuyển thì <code>\"120000\"</code> cộng với số sẽ ra chuỗi nối, một lỗi rất khó lần. Đổi tham số sang chuỗi đẩy phép chuyển vào trong hàm, khiến mọi lời gọi khác phải mang theo kiểu sai. Tắt kiểm kiểu chỉ giấu lỗi chứ không sửa nó."
    },
    {
      id: "cc-opt-weak",
      module: "phan-tich-ngu-nghia",
      tag: "IR",
      title: "Có nên bật cấu hình tối ưu này",
      scenario: "Bản dựng đêm của một trình biên dịch nhỏ chạy bộ tối ưu trên 300 lệnh trung gian. Cấu hình hiện tại chỉ bật gấp hằng ở mức 10% và không bỏ mã chết, nên số lệnh còn 270. Một kỹ sư đề nghị giữ cấu hình này vì thời gian biên dịch tăng mà chương trình chạy nhanh hơn không đáng kể. Kỹ sư khác phản đối, cho rằng giảm được 30 lệnh là đủ để bật. Nhóm cần một tiêu chí rõ ràng thay vì cảm tính, dựa trên số lệnh gốc, tỉ lệ giảm và ngưỡng lợi ích 1,5 lần mà khóa học đang dùng.",
      metrics: [
        { label: "Lệnh gốc", value: "300" },
        { label: "Lệnh còn", value: "270" },
        { label: "Tốc độ", value: "1,11x" }
      ],
      options: [
        "Bật, vì bỏ được 30 lệnh là đã có lợi",
        "Tắt, vì tốc độ chỉ tăng khoảng 1,11 lần, dưới ngưỡng 1,5 lần",
        "Bật, vì gấp hằng luôn an toàn nên cứ giữ mặc định",
        "Tăng gấp hằng lên 50% để chắc chắn vượt ngưỡng"
      ],
      correct: 1,
      explain: "Đáp án đúng là tắt: <code>300 × 0,9 = 270</code> lệnh, tốc độ tăng <code>300 ÷ 270 ≈ 1,11</code> lần, dưới ngưỡng 1,5 lần nên phần thu không bù được thời gian biên dịch và rủi ro sửa sai. Con số 30 lệnh nghe nhiều nhưng chỉ là 10%, và tỉ lệ phần trăm mới quyết định tốc độ, không phải số tuyệt đối. Hai ví dụ đạt ngưỡng là 200 lệnh xuống 80, tức 2,5 lần, và 120 lệnh xuống 54, tức 2,2 lần. Giữ mặc định vì lý do an toàn là lập luận sai: an toàn không thay cho hiệu quả. Tăng gấp hằng lên 50% là thay đổi cấu hình khác, cần đo lại chứ không phải câu trả lời cho câu hỏi này."
    }
  );

  T.cheatsheets.push({
    id: "semantics",
    num: "02",
    module: "phan-tich-ngu-nghia",
    title: "Phân tích ngữ nghĩa",
    intro: "Bảng tra cho chặng phân tích ngữ nghĩa: bốn cấu trúc dữ liệu chính, một dòng bảng ký hiệu đầy đủ trường, luật kiểu thường gặp, cách hạ biểu thức thành ba địa chỉ và checklist đọc IR sau tối ưu.",
    cards: [
      {
        title: "Bốn cấu trúc của chặng nghĩa",
        html: "<table><thead><tr><th>Cấu trúc</th><th>Lưu gì</th><th>Dùng ở đâu</th></tr></thead><tbody><tr><td>Bảng ký hiệu</td><td>Tên, kiểu, tầm vực, độ lệch khung</td><td>Kiểm kiểu và sinh mã</td></tr><tr><td>Ngăn xếp phạm vi</td><td>Các khung lồng nhau</td><td>Tra cứu tên, che khuất</td></tr><tr><td>Bảng luật kiểu</td><td><code>int + int = int</code></td><td>Suy kiểu và hợp nhất</td></tr><tr><td>Danh sách lệnh IR</td><td>Lệnh ba địa chỉ có nhãn</td><td>Tối ưu và sinh mã</td></tr></tbody></table>"
      },
      {
        title: "Một dòng bảng ký hiệu",
        html: "<pre><code>name:   count\nkind:   biến cục bộ\ntype:   int\nscope:  thân hàm main\noffset: -8\nline:   4</code></pre><p>Thêm mục trước, kiểm trùng trong cùng tầm vực, rồi mới cấp phát.</p>"
      },
      {
        title: "Luật kiểu và hợp nhất",
        wide: true,
        html: "<table><thead><tr><th>Phép</th><th>Kiểu trái</th><th>Kiểu phải</th><th>Kết quả</th></tr></thead><tbody><tr><td><code>+</code></td><td>int</td><td>int</td><td>int</td></tr><tr><td><code>+</code></td><td>float</td><td>int</td><td>float, ép trái sang phải</td></tr><tr><td><code>+</code></td><td>string</td><td>string</td><td>string</td></tr><tr><td><code>+</code></td><td>string</td><td>int</td><td>lỗi, không có luật</td></tr><tr><td><code>/</code></td><td>int</td><td>int</td><td>int, chia lấy phần nguyên</td></tr></tbody></table><p>Hai nhánh <code>if</code> khác kiểu thì hợp nhất về kiểu rộng hơn, ví dụ <code>int</code> và <code>float</code> ra <code>float</code>.</p>"
      },
      {
        title: "Từ biểu thức sang ba địa chỉ",
        wide: true,
        html: "<pre><code>x = 4 * 5 + y * 2\n\n  t1 = 4 * 5\n  t2 = y * 2\n  t3 = t1 + t2\n  x  = t3\n\ngấp hằng:\n  t1 = 20\n  t2 = y * 2\n  x  = 20 + t2</code></pre><p>Mỗi lệnh một phép toán: đọc hai nguồn, ghi một đích. Chương trình mẫu cần 200 lệnh IR.</p>"
      },
      {
        title: "Checklist đọc IR sau tối ưu",
        wide: true,
        html: "<ul><li>Đếm lệnh gốc trước, ghi rõ mốc: 200 hoặc 120.</li><li>Nhân lần lượt: <code>200 × 0,5 × 0,8 = 80</code>; <code>120 × 0,6 × 0,75 = 54</code>.</li><li>Chia để ra tốc độ: <code>200 ÷ 80 = 2,5</code>; <code>120 ÷ 54 ≈ 2,2</code>.</li><li>So với ngưỡng 1,5 lần, dưới ngưỡng thì không đáng bật.</li><li>Kiểm lại nhãn nhảy còn trỏ đúng chỗ sau khi xóa lệnh.</li></ul>"
      }
    ]
  });
})();
