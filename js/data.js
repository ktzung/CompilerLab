/* CompilerLab — dữ liệu bài giảng: module Từ vựng và cú pháp */
window.COMPILERLAB = window.COMPILERLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  const C = window.COMPILERLAB;

  C.modules.push({
    id: "tu-vung-va-cu-phap",
    num: "01",
    tone: "blue",
    title: "Từ vựng và cú pháp",
    blurb: "Bốn bài đầu của trình biên dịch: lexer cắt mã nguồn thành token, bảng ký hiệu ghi nhớ từng cái tên, parser ghép token thành cây cú pháp và AST được duyệt để kiểm tra. Mỗi bài có sơ đồ luồng, năm bước phân tích số liệu và một tình huống luyện tập trước khi vào phòng mô phỏng.",
    lessons: ["lexer", "token", "parser", "ast"]
  });

  C.lessons["lexer"] = {
    id: "lexer",
    module: "tu-vung-va-cu-phap",
    title: "Lexer: cắt mã nguồn thành token",
    shortTitle: "Lexer",
    subtitle: "Bỏ khoảng trắng và chú thích, cắt phần mã thực thành từng token",
    blurb: "Lexer là chặng đầu tiên của trình biên dịch. Bài đi từ một tệp 400 ký tự, bỏ 25% khoảng trắng và 15% chú thích để còn 255 ký tự mã, rồi ước lượng 64 token theo quy tắc bốn ký tự một token.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["lexer", "token", "khoảng trắng", "chú thích", "quét ký tự"],
    metrics: [
      { key: "source", label: "Ký tự nguồn", tone: "blue" },
      { key: "code", label: "Ký tự mã", tone: "mint" },
      { key: "token", label: "Số token", tone: "yellow" },
      { key: "verdict", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "src", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Mã nguồn", sub: "400 ký tự thô" },
      { id: "scan", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Bộ quét lexer", sub: "đọc từng ký tự" },
      { id: "skip", type: "check", x: 625, y: 80, w: 200, h: 70, label: "Lọc trắng, chú thích", sub: "25% và 15%" },
      { id: "rule", type: "book", x: 340, y: 195, w: 200, h: 70, label: "Quy tắc token", sub: "4 ký tự một token" },
      { id: "err", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "Lỗi từ vựng", sub: "ký tự không khớp mẫu" },
      { id: "count", type: "grid", x: 340, y: 310, w: 200, h: 70, label: "Đếm token", sub: "255 ký tự mã" },
      { id: "out", type: "queue", x: 625, y: 310, w: 200, h: 70, label: "Dãy token", sub: "64 token kèm vị trí" }
    ],
    edges: [
      { id: "src-scan", from: "src", to: "scan", kind: "request", label: "đọc ký tự" },
      { id: "scan-skip", from: "scan", to: "skip", kind: "data", label: "bỏ trắng" },
      { id: "skip-rule", from: "skip", to: "rule", kind: "control", label: "áp quy tắc" },
      { id: "rule-count", from: "rule", to: "count", kind: "data", label: "đếm token" },
      { id: "count-out", from: "count", to: "out", kind: "data", label: "64 token" },
      { id: "scan-err", from: "scan", to: "err", kind: "control", label: "gặp ký tự lạ" }
    ],
    learn: [
      "Lexer đọc <strong>từng ký tự</strong> một lượt từ trái sang phải, không quay lui.",
      "Khoảng trắng và chú thích bị bỏ, nên <code>400</code> ký tự chỉ còn khoảng <code>255</code> ký tự mã.",
      "Ước lượng <code>4 ký tự một token</code> cho ra khoảng <code>64</code> token.",
      "Ký tự không khớp mẫu nào phải báo <strong>lỗi từ vựng</strong> kèm số dòng."
    ],
    steps: [
      {
        short: "Nguồn thô",
        type: "concept",
        title: "Một tệp văn bản chưa có nghĩa",
        body: "Chương trình bắt đầu bằng một tệp văn bản thuần gồm 400 ký tự: chữ cái, chữ số, dấu câu, dấu cách, xuống dòng và vài đoạn chú thích. Với người đọc, đó là mã nguồn có bố cục rõ ràng; với máy, đó chỉ là một dãy ký tự chưa mang nghĩa gì. Lexer nhận đúng dãy ấy và xử lý tuần tự từ trái sang phải. Trong ví dụ này khoảng trắng chiếm 25%, chú thích chiếm 15%, nên phần mã thực còn khoảng <code>400 × 0,75 × 0,85 = 255</code> ký tự. Việc đầu tiên của bộ quét là nhận ra những đoạn không bao giờ sinh token để loại chúng khỏi dòng xử lý.",
        focus: ["src", "skip"],
        edges: ["src-scan", "scan-skip"],
        metrics: { source: "400", code: "255", token: "0", verdict: "chưa cắt" },
        changes: ["Đếm đủ 400 ký tự nguồn", "Tách riêng 25% trắng và 15% chú thích"],
        note: "Tỉ lệ trắng và chú thích càng cao thì phần mã thực càng mỏng."
      },
      {
        short: "Quét ký tự",
        type: "flow",
        title: "Con trỏ chạy một lượt qua chuỗi",
        body: "Lexer giữ một con trỏ chạy qua chuỗi và xét từng ký tự. Gặp dấu cách, tab hay xuống dòng thì bỏ qua; gặp hai dấu gạch chéo thì nuốt trọn dòng chú thích; gặp chữ cái thì gom thành một từ rồi đối chiếu với danh sách từ khóa. Mỗi lần một mẫu khớp, bộ quét cắt ra một token và đẩy vào dãy kết quả. Với 255 ký tự mã còn lại, ước lượng bốn ký tự cho một token, ta thu được <code>255 / 4 ≈ 64</code> token. Con trỏ chỉ tiến, không bao giờ quay lui, nên chi phí của chặng này tỉ lệ thuận với độ dài nguồn và gần như không phụ thuộc nội dung.",
        focus: ["scan", "skip", "rule"],
        edges: ["scan-skip", "skip-rule"],
        metrics: { source: "400", code: "255", token: "64", verdict: "cắt xong" },
        changes: ["Con trỏ đi hết 400 ký tự", "Mỗi mẫu khớp sinh một token"],
        note: "Ước lượng bốn ký tự một token là con số dùng chung cho cả lab."
      },
      {
        short: "Đếm token",
        type: "detail",
        title: "64 token kèm vị trí dòng, cột",
        body: "Mỗi token không chỉ có chữ mà còn mang nhãn loại và vị trí, ví dụ <code>{ type: \"name\", text: \"tong\", line: 3 }</code>. Nhờ vậy khi báo lỗi, trình biên dịch chỉ đúng dòng và cột thay vì đổ cả tệp. Trong 64 token của ví dụ, phần lớn là tên biến và toán tử, xen vài từ khóa như <code>if</code>, <code>return</code> và các token số. Cách đếm đơn giản là lấy số ký tự mã chia bốn, làm tròn: <code>255 / 4 = 63,75</code> thành 64. Con số này chỉ là ước lượng, vì tên ngắn như <code>x</code> tốn một ký tự nhưng vẫn chiếm trọn một token, còn tên dài lại tốn nhiều ký tự hơn mức trung bình.",
        focus: ["rule", "count", "out"],
        edges: ["rule-count", "count-out"],
        metrics: { source: "400", code: "255", token: "64", verdict: "64 token" },
        changes: ["Chốt con số 64 token", "Mỗi token có thêm dòng và cột"],
        note: "Chia bốn chỉ là ước lượng; token ngắn làm con số thực cao hơn."
      },
      {
        short: "Ký tự lạ",
        type: "pitfall",
        title: "Khi không mẫu nào khớp",
        body: "Nếu gặp ký tự không thuộc mẫu nào, chẳng hạn dấu <code>@</code> đứng giữa biểu thức hay chuỗi thiếu dấu nháy đóng, lexer không thể đoán ý người viết. Cách xử lý an toàn là dừng, báo lỗi từ vựng kèm số dòng, thay vì lặng lẽ bỏ qua rồi để parser nhận một dãy token sai lệch. Một lỗi nhỏ ở đây thường kéo theo hàng loạt thông báo khó hiểu ở chặng sau, vì parser cố ghép những token vốn không thuộc về nhau. Với tệp 400 ký tự, chỉ cần một dấu nháy lạc là toàn bộ 64 token phía sau có thể bị lệch nhãn, nên thông báo sớm và đúng chỗ là khoản đầu tư đáng giá.",
        focus: ["scan", "err"],
        edges: ["scan-err", "scan-skip"],
        metrics: { source: "400", code: "255", token: "64", verdict: "dừng, báo lỗi" },
        changes: ["Phát hiện ký tự không khớp mẫu", "Dừng quét thay vì bỏ qua"],
        note: "Một ký tự lạ đủ làm lệch nhãn của cả dãy token phía sau."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Từ 400 ký tự đến 64 token",
        body: "Tổng kết chặng lexer: nguồn 400 ký tự, bỏ 25% khoảng trắng và 15% chú thích còn 255 ký tự mã, chia bốn được khoảng 64 token. Ba việc cần nhớ là bỏ phần không sinh token, cắt theo mẫu và gắn vị trí cho từng kết quả. Lexer không hiểu câu, nó chỉ phân loại mảnh vụn; hiểu câu là việc của parser ở bài sau. Cũng vì thế mà lỗi từ vựng phải báo ngay tại chỗ, nếu không mọi chặng sau sẽ làm việc trên dữ liệu hỏng. Hãy thử đổi tỉ lệ chú thích trong phòng mô phỏng để thấy số token tụt xuống rõ rệt.",
        focus: "all",
        edges: "all",
        metrics: { source: "400", code: "255", token: "64", verdict: "hoàn tất" },
        changes: ["Khép trọn luồng quét", "Sẵn sàng chuyển sang phân loại token"],
        note: "Nhớ bộ ba 400, 255, 64 khi đối chiếu kết quả engine."
      }
    ]
  };

  C.lessons["token"] = {
    id: "token",
    module: "tu-vung-va-cu-phap",
    title: "Loại token và bảng ký hiệu",
    shortTitle: "Token",
    subtitle: "Năm nhóm token quen thuộc và nơi lưu tên biến, tên hàm",
    blurb: "Mỗi token thuộc một nhóm: từ khóa, tên, số, chuỗi, toán tử. Bài chỉ cách phân loại 64 token của đoạn mã mẫu, cách ghi tên vào bảng ký hiệu và vì sao bảng này là cuốn sổ theo suốt các chặng sau.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["token", "từ khóa", "định danh", "bảng ký hiệu", "phạm vi"],
    metrics: [
      { key: "source", label: "Ký tự nguồn", tone: "blue" },
      { key: "token", label: "Số token", tone: "mint" },
      { key: "kind", label: "Loại token", tone: "yellow" },
      { key: "sym", label: "Tên đã ghi", tone: "coral" }
    ],
    nodes: [
      { id: "src", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Chuỗi nguồn", sub: "int tong = 42;" },
      { id: "lex", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Lexer", sub: "cắt theo mẫu" },
      { id: "kind", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Năm nhóm token", sub: "khóa, tên, số, chuỗi" },
      { id: "table", type: "book", x: 340, y: 195, w: 200, h: 70, label: "Bảng ký hiệu", sub: "tên, kiểu, phạm vi" },
      { id: "num", type: "page", x: 55, y: 310, w: 200, h: 70, label: "Token số", sub: "42, nhãn number" },
      { id: "id", type: "key", x: 340, y: 310, w: 200, h: 70, label: "Token tên", sub: "tong, nhãn name" },
      { id: "err", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Token lỗi", sub: "chuỗi chưa đóng" }
    ],
    edges: [
      { id: "src-lex", from: "src", to: "lex", kind: "request", label: "cắt token" },
      { id: "lex-kind", from: "lex", to: "kind", kind: "data", label: "gán nhãn" },
      { id: "kind-table", from: "kind", to: "table", kind: "control", label: "ghi tên" },
      { id: "table-id", from: "table", to: "id", kind: "data", label: "tra tong" },
      { id: "kind-num", from: "kind", to: "num", kind: "data", label: "token số" },
      { id: "lex-err", from: "lex", to: "err", kind: "control", label: "báo lỗi" }
    ],
    learn: [
      "Từ khóa là những chữ <strong>dành riêng</strong> như <code>if</code>, <code>return</code>.",
      "Tên biến và tên hàm cùng nhãn <code>name</code>, khác nhau ở chỗ ghi trong bảng ký hiệu.",
      "Số và chuỗi giữ nguyên giá trị, không cần tra bảng ký hiệu.",
      "Bảng ký hiệu ghi <strong>một mục cho mỗi tên</strong>, không ghi theo số lần xuất hiện."
    ],
    steps: [
      {
        short: "Năm nhóm",
        type: "concept",
        title: "Mọi token đều có nhãn",
        body: "Một token gồm hai phần: nhãn loại và phần chữ gốc. Năm nhóm quen thuộc là từ khóa, tên, hằng số, chuỗi và toán tử kèm dấu câu. Với đoạn <code>int tong = 42;</code>, lexer sinh ra năm token: từ khóa <code>int</code>, tên <code>tong</code>, toán tử <code>=</code>, số <code>42</code> và dấu chấm phẩy. Cùng một chữ có thể đổi nhãn tùy ngữ cảnh khai báo: <code>int</code> là từ khóa, nhưng <code>int</code> đứng sau dấu chấm lại là tên trường. Toàn bộ 64 token của tệp mẫu được chia vào năm nhóm này, nhờ vậy parser chỉ cần so nhãn thay vì so từng chuỗi ký tự.",
        focus: ["src", "lex", "kind"],
        edges: ["src-lex", "lex-kind"],
        metrics: { source: "400", token: "64", kind: "5", sym: "0" },
        changes: ["Chia 64 token vào năm nhóm", "Mỗi token có nhãn riêng"],
        note: "Nhãn loại giúp parser so sánh nhanh, không phải so chuỗi."
      },
      {
        short: "Phân loại",
        type: "flow",
        title: "Từ khóa trước, tên sau",
        body: "Khi gom xong một từ, lexer tra danh sách từ khóa trước. Nếu khớp, token mang nhãn khóa; nếu không, nó là tên. Cách làm này giải thích vì sao không được đặt tên biến trùng từ khóa: chữ <code>while</code> luôn bị nhận là khóa, không bao giờ thành tên. Số được nhận bằng mẫu chữ số, chuỗi bằng cặp dấu nháy, toán tử bằng bảng ký hiệu dài nhất khớp trước, nên <code>==</code> không bị cắt thành hai dấu <code>=</code>. Trong 64 token của ví dụ, khoảng một phần ba là tên, phần còn lại chia cho bốn nhóm kia.",
        focus: ["lex", "kind", "num"],
        edges: ["lex-kind", "kind-num"],
        metrics: { source: "400", token: "64", kind: "5", sym: "0" },
        changes: ["Tra từ khóa trước khi nhận tên", "Mẫu dài nhất được ưu tiên"],
        note: "Ưu tiên mẫu dài nhất để == không bị tách thành hai dấu =."
      },
      {
        short: "Bảng ký hiệu",
        type: "detail",
        title: "Cuốn sổ ghi tên và kiểu",
        body: "Bảng ký hiệu là nơi lưu mỗi tên một mục, kèm kiểu dữ liệu, phạm vi và vị trí khai báo. Tên <code>tong</code> xuất hiện bốn lần trong mã vẫn chỉ chiếm một mục, vì bảng ghi danh tính chứ không ghi số lần dùng. Mỗi mục thường có dạng <code>{ name: \"tong\", type: \"int\", scope: 0 }</code>. Khi vào một khối mới, trình biên dịch mở thêm một tầng phạm vi, nên hai biến cùng tên ở hai khối khác nhau là hai mục riêng. Với 64 token và khoảng 12 tên khác nhau, bảng ký hiệu gọn hơn nhiều so với dãy token ban đầu.",
        focus: ["kind", "table", "id"],
        edges: ["kind-table", "table-id"],
        metrics: { source: "400", token: "64", kind: "5", sym: "12" },
        changes: ["Ghi 12 tên vào bảng", "Mỗi tầng phạm vi mở một nhóm mục"],
        note: "Bảng ghi theo tên, không theo số lần xuất hiện."
      },
      {
        short: "Bẫy thường gặp",
        type: "pitfall",
        title: "Chuỗi chưa đóng và tên trùng khóa",
        body: "Hai lỗi hay gặp ở chặng này. Thứ nhất là chuỗi thiếu dấu nháy đóng: lexer nuốt luôn phần còn lại của tệp vào một token chuỗi, khiến các token phía sau biến mất, nên phải báo lỗi ngay tại dòng mở chuỗi. Thứ hai là đặt tên biến trùng từ khóa, ví dụ <code>class</code>, khiến mọi lần dùng sau đó bị hiểu sai nhãn. Ngoài ra, ghi bảng ký hiệu theo số lần xuất hiện sẽ đẩy 12 tên thành 40 mục rác, làm chậm bước tra cứu về sau. Cả ba lỗi đều rẻ khi sửa sớm và rất đắt khi đã đi qua các chặng sau.",
        focus: ["lex", "err", "table"],
        edges: ["lex-err", "kind-table"],
        metrics: { source: "400", token: "64", kind: "5", sym: "12" },
        changes: ["Phát hiện chuỗi chưa đóng", "Giữ bảng ký hiệu không trùng mục"],
        note: "Chuỗi chưa đóng nuốt cả phần còn lại của tệp vào một token."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Nhãn, tên và cuốn sổ",
        body: "Tổng kết: 64 token của tệp mẫu chia vào năm nhóm, trong đó khoảng 12 tên được ghi vào bảng ký hiệu, mỗi tên đúng một mục. Nhãn loại giúp parser so khớp nhanh, còn bảng ký hiệu giúp các chặng sau biết một cái tên là biến, hàm hay tham số. Hai công cụ này đi cùng nhau: token trả lời câu hỏi đây là loại gì, bảng ký hiệu trả lời câu hỏi cái tên này thuộc về đâu. Bài tiếp theo dùng chính dãy token đã gắn nhãn để ghép thành cây cú pháp, và sẽ dừng lại ngay khi gặp một token lỗi.",
        focus: "all",
        edges: "all",
        metrics: { source: "400", token: "64", kind: "5", sym: "12" },
        changes: ["Khép chặng phân loại token", "Bảng ký hiệu sẵn sàng cho parser"],
        note: "Hai câu hỏi cần phân biệt: loại gì, và tên thuộc phạm vi nào."
      }
    ]
  };

  C.lessons["parser"] = {
    id: "parser",
    module: "tu-vung-va-cu-phap",
    title: "Parser: dựng cây cú pháp",
    shortTitle: "Parser",
    subtitle: "Ghép token theo văn phạm và dừng ngay khi gặp lỗi cú pháp",
    blurb: "Parser đọc dãy token và ghép chúng theo luật văn phạm thành cây. Bài tính 50 nút cho 10 câu lệnh lồng ba tầng, rồi xem vì sao chỉ hai lỗi cú pháp đã đủ khiến cả cây không dựng được.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["parser", "văn phạm", "cây cú pháp", "độ sâu", "lỗi cú pháp"],
    metrics: [
      { key: "stmt", label: "Câu lệnh", tone: "blue" },
      { key: "depth", label: "Độ sâu", tone: "mint" },
      { key: "node", label: "Số nút", tone: "yellow" },
      { key: "verdict", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "src", type: "queue", x: 55, y: 80, w: 200, h: 70, label: "Dãy token", sub: "64 token đã gắn nhãn" },
      { id: "parse", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Parser", sub: "đọc theo văn phạm" },
      { id: "rule", type: "book", x: 625, y: 80, w: 200, h: 70, label: "Luật văn phạm", sub: "câu lệnh, biểu thức" },
      { id: "err", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Lỗi cú pháp", sub: "dừng, không dựng cây" },
      { id: "leaf", type: "grid", x: 55, y: 310, w: 200, h: 70, label: "Nút con", sub: "toán hạng, toán tử" },
      { id: "root", type: "layers", x: 340, y: 310, w: 200, h: 70, label: "Nút gốc", sub: "một chương trình" },
      { id: "tree", type: "star", x: 625, y: 310, w: 200, h: 70, label: "Cây cú pháp", sub: "50 nút, sâu 3" }
    ],
    edges: [
      { id: "src-parse", from: "src", to: "parse", kind: "request", label: "đọc token" },
      { id: "parse-rule", from: "parse", to: "rule", kind: "data", label: "đối chiếu luật" },
      { id: "parse-err", from: "parse", to: "err", kind: "control", label: "gặp lỗi" },
      { id: "parse-root", from: "parse", to: "root", kind: "control", label: "tạo gốc" },
      { id: "root-leaf", from: "root", to: "leaf", kind: "data", label: "mở nhánh" },
      { id: "root-tree", from: "root", to: "tree", kind: "data", label: "10 câu lệnh" }
    ],
    learn: [
      "Parser kiểm tra dãy token có <strong>khớp văn phạm</strong> hay không.",
      "Mỗi câu lệnh sinh một nút gốc và khoảng hai nút con mỗi tầng.",
      "Công thức của lab: <code>nút = câu lệnh × (2 + độ sâu)</code>.",
      "Chỉ một lỗi cú pháp là <strong>cả cây</strong> không dựng được."
    ],
    steps: [
      {
        short: "Đọc token",
        type: "concept",
        title: "Đầu vào là dãy đã gắn nhãn",
        body: "Parser nhận dãy token do lexer để lại, không nhìn lại ký tự gốc. Mỗi bước nó xem token hiện tại thuộc nhãn nào rồi chọn luật văn phạm tương ứng: gặp tên thì chờ một phép gán, gặp <code>if</code> thì chờ điều kiện và thân lệnh. Với tệp mẫu, 64 token được gom thành 10 câu lệnh độc lập. Việc đọc tuần tự và chỉ tiến giúp parser chạy một lượt, nhưng cũng buộc văn phạm phải được thiết kế để nhìn một token là biết đường đi. Nếu văn phạm mơ hồ, cùng một dãy token có thể dựng ra hai cây khác nhau và trình biên dịch phải chọn một cách tùy ý.",
        focus: ["src", "parse", "rule"],
        edges: ["src-parse", "parse-rule"],
        metrics: { stmt: "10", depth: "3", node: "0", verdict: "đang đọc" },
        changes: ["Nhận dãy 64 token", "Chọn luật theo nhãn token"],
        note: "Văn phạm mơ hồ cho phép hai cây khác nhau từ cùng một dãy token."
      },
      {
        short: "Ghép cây",
        type: "flow",
        title: "Mỗi câu lệnh mọc một nhánh",
        body: "Mỗi câu lệnh tạo một nút gốc, và mỗi tầng lồng thêm khoảng hai nút con. Với 10 câu lệnh lồng ba tầng, số nút là <code>10 × (2 + 3) = 50</code>. Cây mọc từ gốc chương trình xuống các câu lệnh, rồi xuống biểu thức, cuối cùng là toán hạng lá như tên biến hay hằng số. Cách đếm này khớp với engine của lab nên có thể đối chiếu ngay trên màn hình. Cây không chỉ để vẽ: nó ghi rõ phép nào bọc phép nào, nhờ đó chặng sau biết phải tính <code>a + b * c</code> theo thứ tự nhân trước, cộng sau mà không cần nhớ quy tắc ưu tiên.",
        focus: ["parse", "root", "leaf", "tree"],
        edges: ["parse-root", "root-leaf", "root-tree"],
        metrics: { stmt: "10", depth: "3", node: "50", verdict: "dựng được" },
        changes: ["Dựng 50 nút", "Ưu tiên toán tử nằm trong hình cây"],
        note: "10 × (2 + 3) = 50 là công thức đếm nút của engine."
      },
      {
        short: "Độ sâu",
        type: "detail",
        title: "Lồng càng sâu, cây càng cao",
        body: "Độ sâu là số tầng lồng nhau nhiều nhất trong một câu lệnh, ví dụ ba tầng với hai lớp <code>if</code> bọc một vòng lặp. Độ sâu tăng thì số nút tăng tuyến tính: giữ 10 câu lệnh nhưng nâng độ sâu lên 6, số nút thành <code>10 × (2 + 6) = 80</code>. Cây cao cũng đặt ra giới hạn thực tế, vì parser đệ quy sẽ dùng một khung ngăn xếp cho mỗi tầng; lồng quá sâu có thể làm tràn ngăn xếp trước khi kịp báo lỗi cú pháp. Trình biên dịch thật thường đặt trần độ sâu, ví dụ 256 tầng, để chặn kiểu tệp sinh tự động làm cạn bộ nhớ.",
        focus: ["root", "tree", "leaf"],
        edges: ["root-tree", "root-leaf"],
        metrics: { stmt: "10", depth: "6", node: "80", verdict: "cao hơn" },
        changes: ["Độ sâu 3 lên 6", "Số nút 50 lên 80"],
        note: "Đệ quy tốn một khung ngăn xếp cho mỗi tầng lồng."
      },
      {
        short: "Hai lỗi",
        type: "pitfall",
        title: "Một lỗi là cả cây dừng",
        body: "Với 10 câu lệnh, độ sâu 3 nhưng có 2 lỗi cú pháp, kết quả không phải 48 nút mà là 0 nút: parser dừng và không dựng cây. Lý do là cây chỉ có nghĩa khi ghép đủ mọi token; thiếu một dấu đóng ngoặc thì nhánh phía trên không biết kết thúc ở đâu. Engine của lab mô tả đúng như vậy, nên khi thử hai lỗi, bạn sẽ thấy số nút bằng không và trạng thái dừng. Cách sửa là sửa từ lỗi đầu tiên, dựng lại, rồi mới xem lỗi tiếp theo, vì thông báo thứ hai thường chỉ là hệ quả của lỗi thứ nhất.",
        focus: ["parse", "err", "rule"],
        edges: ["parse-err", "parse-rule"],
        metrics: { stmt: "10", depth: "3", node: "0", verdict: "dừng" },
        changes: ["Thêm 2 lỗi cú pháp", "Cây không dựng, 0 nút"],
        note: "Không có cây dở dang: hoặc đủ 50 nút, hoặc 0."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Cây là bản đồ của câu lệnh",
        body: "Tổng kết chặng parser: 10 câu lệnh lồng ba tầng cho 50 nút; nâng độ sâu lên 6 thì thành 80 nút; thêm 2 lỗi cú pháp thì cây về 0. Ba con số này đủ để đọc mọi kết quả trong phòng mô phỏng. Điều cần nhớ là parser không sửa lỗi, nó chỉ phát hiện và dừng, nên chất lượng thông báo phụ thuộc vào việc báo đúng token đầu tiên sai. Cây dựng xong sẽ được chuyển sang dạng AST gọn hơn ở bài sau, nơi dấu ngoặc thừa và chi tiết cú pháp bị lược bỏ để các chặng phân tích làm việc dễ hơn.",
        focus: "all",
        edges: "all",
        metrics: { stmt: "10", depth: "3", node: "50", verdict: "hoàn tất" },
        changes: ["Khép luồng dựng cây", "Chuyển cây thô sang AST"],
        note: "Ba con số 50, 80, 0 tóm gọn toàn bộ chặng parser."
      }
    ]
  };

  C.lessons["ast"] = {
    id: "ast",
    module: "tu-vung-va-cu-phap",
    title: "AST và cách duyệt cây",
    shortTitle: "AST",
    subtitle: "Rút gọn cây cú pháp và đi qua từng nút theo thứ tự",
    blurb: "AST giữ lại phần có nghĩa của chương trình và bỏ dấu ngoặc, dấu chấm phẩy. Bài đi qua 50 nút của cây mẫu, ba thứ tự duyệt quen thuộc và cách gắn kiểu cho từng nút trước khi sinh mã.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["AST", "duyệt cây", "tiền thứ tự", "hậu thứ tự", "kiểm kiểu"],
    metrics: [
      { key: "node", label: "Nút AST", tone: "blue" },
      { key: "depth", label: "Độ sâu", tone: "mint" },
      { key: "visit", label: "Lượt thăm", tone: "yellow" },
      { key: "verdict", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "src", type: "layers", x: 55, y: 80, w: 200, h: 70, label: "Cây cú pháp", sub: "50 nút thô" },
      { id: "build", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Dựng AST", sub: "bỏ ngoặc, chấm phẩy" },
      { id: "visit", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Duyệt cây", sub: "thăm từng nút" },
      { id: "order", type: "book", x: 340, y: 195, w: 200, h: 70, label: "Ba thứ tự", sub: "trước, giữa, sau" },
      { id: "check", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Kiểm kiểu", sub: "gắn kiểu cho nút" },
      { id: "out", type: "queue", x: 340, y: 310, w: 200, h: 70, label: "Dãy sự kiện", sub: "enter, leave" },
      { id: "ir", type: "bolt", x: 625, y: 310, w: 200, h: 70, label: "IR chuyển tiếp", sub: "50 lệnh trung gian" }
    ],
    edges: [
      { id: "src-build", from: "src", to: "build", kind: "request", label: "rút gọn cây" },
      { id: "build-visit", from: "build", to: "visit", kind: "data", label: "AST 46 nút" },
      { id: "visit-order", from: "visit", to: "order", kind: "control", label: "chọn thứ tự" },
      { id: "order-out", from: "order", to: "out", kind: "data", label: "dãy thăm" },
      { id: "check-out", from: "check", to: "out", kind: "data", label: "kiểu đã gắn" },
      { id: "out-ir", from: "out", to: "ir", kind: "data", label: "sinh IR" }
    ],
    learn: [
      "AST bỏ dấu ngoặc và dấu câu, chỉ giữ <strong>cấu trúc có nghĩa</strong>.",
      "Duyệt tiền thứ tự thăm nút cha trước, hậu thứ tự thăm con trước.",
      "Mỗi nút được thăm đúng <strong>một lần</strong> trong một lượt duyệt.",
      "Kiểm kiểu đi kèm duyệt cây để gắn kiểu và báo lỗi sớm."
    ],
    steps: [
      {
        short: "Rút gọn",
        type: "concept",
        title: "Từ cây thô sang AST",
        body: "Cây cú pháp thô giữ mọi chi tiết của văn bản, kể cả dấu ngoặc và dấu chấm phẩy. AST lược bỏ những phần không đổi nghĩa: dấu ngoặc đã được hình cây thể hiện, dấu chấm phẩy chỉ để tách câu. Với cây 50 nút của bài trước, bước rút gọn bỏ khoảng bốn nút phụ và còn 46 nút mang nghĩa. Mỗi nút AST thường có dạng <code>{ kind: \"add\", left, right }</code>, không còn trường vị trí in ấn. Nhờ gọn hơn, AST dễ duyệt, dễ so sánh và là đầu vào chuẩn cho kiểm kiểu, tối ưu và sinh mã ở các chặng sau.",
        focus: ["src", "build", "visit"],
        edges: ["src-build", "build-visit"],
        metrics: { node: "46", depth: "3", visit: "0", verdict: "đã gọn" },
        changes: ["Bỏ dấu ngoặc và chấm phẩy", "Cây thô 50 nút còn 46"],
        note: "Cây đã thể hiện thứ tự, nên dấu ngoặc thành thừa."
      },
      {
        short: "Ba thứ tự",
        type: "flow",
        title: "Trước, giữa và sau",
        body: "Ba thứ tự duyệt quen thuộc là tiền thứ tự, trung thứ tự và hậu thứ tự. Tiền thứ tự thăm nút cha rồi mới xuống con, hợp để in lại biểu thức có ngoặc. Trung thứ tự thăm con trái, rồi cha, rồi con phải, nên với cây biểu thức cho ra đúng dãy toán học quen thuộc. Hậu thứ tự thăm con trước, cha sau, rất hợp để sinh mã vì toán hạng đã sẵn sàng khi gặp toán tử. Với 46 nút, mỗi lượt duyệt thăm đúng 46 lần, không hơn: chọn thứ tự nào cũng cùng chi phí, chỉ khác thời điểm xử lý mỗi nút.",
        focus: ["visit", "order", "out"],
        edges: ["visit-order", "order-out"],
        metrics: { node: "46", depth: "3", visit: "46", verdict: "một lượt" },
        changes: ["Chọn thứ tự duyệt", "Mỗi nút được thăm một lần"],
        note: "Hậu thứ tự hợp sinh mã vì con xong trước cha."
      },
      {
        short: "Kiểm kiểu",
        type: "detail",
        title: "Gắn kiểu khi đi qua",
        body: "Duyệt cây cũng là dịp gắn kiểu cho từng nút. Đi từ lá lên, nút số <code>42</code> nhận kiểu số nguyên, nút cộng nhận kiểu của hai con và kiểm tra chúng tương thích. Nếu một bên là chuỗi, một bên là số, bước này báo lỗi kiểu thay vì để chương trình sai lúc chạy. Trên 46 nút của cây mẫu, một lượt kiểm kiểu thăm đủ 46 nút và ghi lại kết quả vào chính nút đó, ví dụ <code>{ kind: \"add\", type: \"int\" }</code>. Nhờ vậy chặng sinh mã không phải suy luận lại, chỉ đọc kiểu đã gắn và chọn lệnh máy phù hợp với độ rộng dữ liệu.",
        focus: ["check", "out", "visit"],
        edges: ["check-out", "visit-order"],
        metrics: { node: "46", depth: "3", visit: "92", verdict: "đã gắn kiểu" },
        changes: ["Gắn kiểu cho 46 nút", "Phát hiện lỗi kiểu sớm"],
        note: "Kiểu gắn một lần, các chặng sau chỉ đọc lại."
      },
      {
        short: "Bẫy đệ quy",
        type: "pitfall",
        title: "Cây sâu và nút bị bỏ sót",
        body: "Hai lỗi hay gặp khi duyệt AST. Thứ nhất là quên nhánh: viết hàm chỉ xử lý con trái, hoặc thoát sớm khi gặp nút lạ, khiến một phần cây không được kiểm kiểu mà không ai báo. Thứ hai là đệ quy không có trần: cây lồng sáu tầng vẫn ổn, nhưng tệp sinh tự động có thể tạo cây sâu hàng nghìn tầng và làm tràn ngăn xếp. Cách phòng là dùng ngăn xếp tường minh hoặc đặt giới hạn độ sâu, đồng thời đếm số nút đã thăm rồi so với tổng số nút. Với cây 46 nút, bộ đếm phải dừng đúng ở 46, thiếu một là có nhánh bị bỏ.",
        focus: ["visit", "order", "check"],
        edges: ["visit-order", "check-out"],
        metrics: { node: "46", depth: "3", visit: "45", verdict: "sót một nút" },
        changes: ["Bộ đếm thăm thiếu một nút", "Phát hiện nhánh chưa xử lý"],
        note: "Đếm số nút đã thăm là cách rẻ nhất bắt lỗi bỏ nhánh."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Cây gọn, duyệt đủ, kiểu rõ",
        body: "Tổng kết: cây thô 50 nút rút về AST 46 nút, mỗi lượt duyệt thăm đủ 46 lần, kiểm kiểu gắn xong trước khi sinh mã. Ba thứ tự duyệt chỉ khác thời điểm xử lý, không khác chi phí. Cần nhớ hai điều: AST bỏ phần trang trí để giữ cấu trúc, và mọi lượt duyệt phải phủ hết cây, nếu không lỗi kiểu sẽ lọt xuống tận lúc chạy. Từ đây, dữ liệu đã sẵn sàng cho chặng sinh mã trung gian và tối ưu, nơi mỗi phép biến đổi lại là một lượt duyệt khác trên cùng cái cây ấy.",
        focus: "all",
        edges: "all",
        metrics: { node: "46", depth: "3", visit: "46", verdict: "hoàn tất" },
        changes: ["Khép chặng AST", "Sẵn sàng sinh mã trung gian"],
        note: "Cùng một cây, nhiều lượt duyệt: kiểm kiểu, tối ưu, sinh mã."
      }
    ]
  };

  C.practice.push(
    {
      tag: "LEXER",
      title: "Đoạn mã dày, ít khoảng trắng",
      scenario: "Một bạn viết hàm tính tổng trong 200 ký tự, không có chú thích nào, khoảng trắng chỉ chiếm 10%. Bạn ấy chạy lexer của lab và tự nhẩm rằng sẽ có 50 token vì lấy 200 chia cho 4. Kết quả trên màn hình lại thấp hơn. Hãy tính đúng số ký tự mã còn lại sau khi bỏ khoảng trắng, rồi chia cho 4 và làm tròn, để chọn con số token mà engine trả về cho đoạn mã này. Chú ý kết quả phải làm tròn tới số nguyên gần nhất, không cắt bỏ phần lẻ.",
      metrics: [
        { label: "Ký tự nguồn", value: "200" },
        { label: "Khoảng trắng", value: "10%" },
        { label: "Chú thích", value: "0%" }
      ],
      options: ["45 token", "50 token", "36 token", "20 token"],
      correct: 0,
      explain: "Đáp án đúng là 45 token. Khoảng trắng 10% bị bỏ trước, nên ký tự mã là <code>200 × 0,9 = 180</code>; chia bốn được <code>45</code> token, đúng bằng kết quả engine. Chọn 50 là quên bỏ khoảng trắng, tức lấy nguyên 200 chia bốn. Chọn 36 là bỏ thêm 20% chú thích dù đoạn mã không có chú thích nào. Chọn 20 là chia đôi sai hoặc nhầm sang tỉ lệ khác. Quy tắc cần nhớ: bỏ trắng và chú thích trước, sau đó mới chia bốn, và làm tròn tới số nguyên gần nhất."
    },
    {
      tag: "TOKEN",
      title: "Bảng ký hiệu ghi theo tên hay theo lần dùng",
      scenario: "Một đoạn mã có 64 token. Trong đó có 12 tên khác nhau, và tên tong xuất hiện bốn lần ở bốn câu lệnh. Một bạn chuẩn bị ghi bảng ký hiệu và phân vân giữa việc ghi 12 mục, ghi 15 mục vì cộng thêm ba lần lặp của tong, hay ghi đủ 64 mục cho mọi token. Bạn ấy muốn bảng vừa đủ để các chặng sau tra cứu nhanh mà không bỏ sót tên nào đã khai báo trong chương trình, kể cả tên chỉ xuất hiện một lần.",
      metrics: [
        { label: "Token", value: "64" },
        { label: "Tên khác nhau", value: "12" },
        { label: "tong xuất hiện", value: "4 lần" }
      ],
      options: ["12 mục", "15 mục", "16 mục", "64 mục"],
      correct: 0,
      explain: "Đáp án đúng là 12 mục. Bảng ký hiệu ghi danh tính của từng tên, không ghi số lần xuất hiện, nên <code>tong</code> dùng bốn lần vẫn chỉ một mục. Chọn 15 là cộng thêm ba lần lặp, sai vì như vậy cùng một biến có bốn mục và tra cứu sẽ trả về mục nào cũng được. Chọn 16 không ứng với dữ kiện nào trong đề. Chọn 64 là ghi cả từ khóa, toán tử và hằng số, những thứ không phải tên nên không thuộc bảng ký hiệu. Quy tắc: một tên một mục, tách theo phạm vi khai báo."
    }
  );

  C.cheatsheets.push({
    id: "syntax",
    num: "01",
    title: "Từ vựng và cú pháp",
    intro: "Tấm thẻ tra nhanh cho chặng đầu của trình biên dịch: công thức đếm token, năm nhóm token, cách dựng cây cú pháp và ba thứ tự duyệt AST. Dùng kèm phòng mô phỏng để đối chiếu từng con số với engine của lab.",
    cards: [
      {
        title: "Công thức đếm token",
        wide: true,
        html: "<p>Bỏ khoảng trắng và chú thích trước, sau đó chia bốn và làm tròn.</p><pre><code>ký tự mã = ký tự nguồn × (1 − trắng%) × (1 − chú thích%)\ntoken     = round(ký tự mã / 4)</code></pre><table><thead><tr><th>Nguồn</th><th>Trắng</th><th>Chú thích</th><th>Ký tự mã</th><th>Token</th></tr></thead><tbody><tr><td>400</td><td>25%</td><td>15%</td><td>255</td><td>64</td></tr><tr><td>200</td><td>10%</td><td>0%</td><td>180</td><td>45</td></tr><tr><td>400</td><td>20%</td><td>30%</td><td>224</td><td>56</td></tr></tbody></table>"
      },
      {
        title: "Năm nhóm token",
        html: "<ul><li><strong>Từ khóa</strong>: if, while, return, int. Tra trước tiên.</li><li><strong>Tên</strong>: biến, hàm, tham số. Ghi vào bảng ký hiệu.</li><li><strong>Hằng số</strong>: 42, 3.14. Giữ nguyên giá trị.</li><li><strong>Chuỗi</strong>: cặp dấu nháy, phải đóng đủ.</li><li><strong>Toán tử, dấu câu</strong>: +, ==, ;, ( ). Ưu tiên mẫu dài nhất.</li></ul>"
      },
      {
        title: "Bảng ký hiệu",
        html: "<table><thead><tr><th>Tên</th><th>Kiểu</th><th>Phạm vi</th></tr></thead><tbody><tr><td>tong</td><td>int</td><td>0</td></tr><tr><td>dem</td><td>int</td><td>1</td></tr><tr><td>tong</td><td>float</td><td>2</td></tr></tbody></table><p>Một tên một mục trong mỗi phạm vi; khối mới mở tầng mới.</p>"
      },
      {
        title: "Đếm nút cây cú pháp",
        html: "<pre><code>nút = câu lệnh × (2 + độ sâu)\n\n10 câu, sâu 3  → 50 nút\n10 câu, sâu 6  → 80 nút\n10 câu, 2 lỗi  → 0 nút, parser dừng</code></pre><p>Không có cây dở dang: hoặc đủ nút, hoặc không dựng.</p>"
      },
      {
        title: "Ba thứ tự duyệt AST",
        wide: true,
        html: "<table><thead><tr><th>Thứ tự</th><th>Trình tự thăm</th><th>Dùng cho</th></tr></thead><tbody><tr><td>Tiền thứ tự</td><td>cha, trái, phải</td><td>In lại biểu thức</td></tr><tr><td>Trung thứ tự</td><td>trái, cha, phải</td><td>Đọc biểu thức theo toán học</td></tr><tr><td>Hậu thứ tự</td><td>trái, phải, cha</td><td>Sinh mã, kiểm kiểu từ lá lên</td></tr></tbody></table><pre><code>void visit(Node n) {\n  if (n == null) return;\n  visit(n.left);\n  visit(n.right);\n  emit(n);  // hậu thứ tự\n}</code></pre>"
      }
    ]
  });
})();
