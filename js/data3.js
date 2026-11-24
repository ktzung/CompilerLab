/* CompilerLab - dữ liệu phần 3: module Tối ưu và sinh mã */
window.COMPILERLAB = window.COMPILERLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

window.COMPILERLAB.modules.push({
  id: "toi-uu-va-sinh-ma",
  num: "03",
  tone: "yellow",
  title: "Tối ưu và sinh mã",
  blurb: "Hai chặng cuối của trình biên dịch: làm chương trình nhỏ và nhanh hơn rồi dịch xuống lệnh máy thật. Bốn bài đi từ các lượt tối ưu trên IR, cấp phát thanh ghi, chọn lệnh cho kiến trúc đích đến chi phí thời gian chạy và bộ nhớ.",
  lessons: ["optimize", "register", "codegen", "runtime"]
});

window.COMPILERLAB.lessons["optimize"] = {
  id: "optimize",
  module: "toi-uu-va-sinh-ma",
  title: "Các lượt tối ưu",
  shortTitle: "Tối ưu",
  subtitle: "Gấp hằng, bỏ mã chết và ngưỡng đáng kể",
  blurb: "Tối ưu chạy trên mã trung gian chứ không phải mã nguồn. Bài đo hai lượt gấp hằng và bỏ mã chết trên chương trình 200 lệnh IR, rồi so với một ca yếu hơn để thấy khi nào tối ưu đáng kể.",
  duration: "12 phút",
  level: "Trung cấp",
  tags: ["IR", "gấp hằng", "mã chết", "tăng tốc", "đồ thị luồng"],
  metrics: [
    { key: "ir", label: "Lệnh IR", tone: "blue" },
    { key: "fold", label: "Gấp hằng", tone: "mint" },
    { key: "dead", label: "Bỏ mã chết", tone: "yellow" },
    { key: "speed", label: "Tăng tốc", tone: "coral" }
  ],
  nodes: [
    { id: "ir", type: "code", x: 55, y: 80, w: 200, h: 70, label: "Mã trung gian IR", sub: "200 lệnh ba địa chỉ" },
    { id: "fold", type: "bolt", x: 340, y: 80, w: 200, h: 70, label: "Gấp hằng số", sub: "50% biểu thức tĩnh" },
    { id: "cfg", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Đồ thị luồng", sub: "khối cơ bản" },
    { id: "dead", type: "audit", x: 340, y: 195, w: 200, h: 70, label: "Bỏ mã chết", sub: "20% lệnh không dùng" },
    { id: "gen", type: "server", x: 55, y: 310, w: 200, h: 70, label: "Sinh mã máy", sub: "chọn lệnh cho CPU" },
    { id: "clock", type: "clock", x: 340, y: 310, w: 200, h: 70, label: "Đo tốc độ", sub: "1,5 lần mới đáng kể" },
    { id: "warn", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Tối ưu vô ích", sub: "dưới 10% thì gần như không" }
  ],
  edges: [
    { id: "ir-fold", from: "ir", to: "fold", kind: "data", label: "gấp 50%" },
    { id: "ir-cfg", from: "ir", to: "cfg", kind: "request", label: "dựng đồ thị" },
    { id: "fold-dead", from: "fold", to: "dead", kind: "data", label: "kết quả gấp" },
    { id: "cfg-dead", from: "cfg", to: "dead", kind: "data", label: "đánh dấu sống" },
    { id: "dead-gen", from: "dead", to: "gen", kind: "control", label: "bỏ lệnh thừa" },
    { id: "gen-clock", from: "gen", to: "clock", kind: "data", label: "đo thời gian" },
    { id: "clock-warn", from: "clock", to: "warn", kind: "control", label: "dưới 1,5 lần" }
  ],
  learn: [
    "Tối ưu chạy trên <code>IR</code>, nơi mỗi lệnh chỉ còn một phép toán.",
    "Gấp hằng thay biểu thức tĩnh bằng kết quả đã tính sẵn.",
    "Bỏ mã chết dựa trên <code>đồ thị luồng</code> để tìm lệnh không ai dùng.",
    "Dưới ngưỡng <code>1,5 lần</code> thì tối ưu chưa đáng kể."
  ],
  steps: [
    {
      short: "Gấp hằng",
      type: "concept",
      title: "Tính trước những gì đã biết",
      body: "Tối ưu diễn ra trên mã trung gian, nơi mỗi lệnh chỉ mang một phép toán và tối đa ba địa chỉ. Chương trình mẫu có 200 lệnh IR, và lượt đầu tiên là gấp hằng: mọi biểu thức chỉ gồm hằng số được tính sẵn ngay lúc biên dịch. Phép gán <code>x = 6 * 7</code> thành <code>x = 42</code>, còn nhánh <code>if (2 &gt; 1)</code> bị xóa hẳn vì điều kiện luôn đúng. Ở cấu hình mặc định, lượt này xử lý 50% số lệnh, kéo chương trình từ 200 xuống còn 100 lệnh. Đây là lượt rẻ nhất vì chỉ cần nhìn từng biểu thức, không cần dựng đồ thị luồng.",
      focus: ["ir", "fold", "cfg"],
      edges: ["ir-fold", "ir-cfg"],
      metrics: { ir: "200", fold: "50%", dead: "0%", speed: "2,0 lần" },
      changes: ["200 lệnh IR còn 100 sau khi gấp hằng", "50% biểu thức tĩnh biến thành hằng số"],
      note: "Gấp hằng không đổi ngữ nghĩa, chỉ thay phần việc đã biết trước bằng kết quả."
    },
    {
      short: "Mã chết",
      type: "flow",
      title: "Dọn phần không ai đọc",
      body: "Lượt thứ hai là bỏ mã chết. Trình biên dịch dựng đồ thị luồng điều khiển từ 100 lệnh còn lại, đánh dấu những lệnh thật sự được thực thi rồi xóa phần không thể tới. Ở cấu hình mặc định, 20% lệnh bị bỏ, đưa chương trình từ 100 xuống 80 lệnh. Tốc độ tăng tính bằng 200 chia 80, tức 2,5 lần, vượt xa ngưỡng đáng kể 1,5 lần mà tài liệu nội bộ đặt ra. Điều đáng chú ý là hai lượt cộng dồn theo phép nhân chứ không cộng thẳng: 50% rồi 20% cho ra 40% còn lại, không phải 30%.",
      focus: ["cfg", "dead", "gen", "clock"],
      edges: ["cfg-dead", "dead-gen", "gen-clock", "fold-dead"],
      metrics: { ir: "200", fold: "50%", dead: "20%", speed: "2,5 lần" },
      changes: ["100 lệnh còn 80 sau khi bỏ mã chết", "Tốc độ tăng từ 2,0 lên 2,5 lần"],
      note: "Hai lượt nhân với nhau: 200 × 0,5 × 0,8 = 80 lệnh."
    },
    {
      short: "Ca mạnh",
      type: "detail",
      title: "120 lệnh, còn 54",
      body: "Một chương trình khác có 120 lệnh IR, gấp hằng xử lý 40% và bỏ mã chết dọn 25% phần còn lại. Sau lượt đầu còn 72 lệnh, sau lượt hai còn 54 lệnh. Tốc độ tăng là 120 chia 54, xấp xỉ 2,22, làm tròn một chữ số thập phân thành 2,2 lần. Con số này vẫn vượt ngưỡng 1,5 lần nên kết luận là tối ưu đáng kể. Ví dụ thực tế: một vòng lặp tính tiền cho 120 dòng hóa đơn chỉ còn 54 phép toán, người dùng thấy danh sách cập nhật gần như tức thì thay vì khựng lại mỗi lần cuộn.",
      focus: ["ir", "fold", "dead", "clock"],
      edges: ["ir-fold", "fold-dead", "gen-clock"],
      metrics: { ir: "120", fold: "40%", dead: "25%", speed: "2,2 lần" },
      changes: ["120 lệnh IR còn 54 sau hai lượt", "Tốc độ tăng chốt ở 2,2 lần"],
      note: "Đây là cấu hình mạnh nhất trong ba bộ dữ liệu mẫu của phòng mô phỏng."
    },
    {
      short: "Ca yếu",
      type: "pitfall",
      title: "Giảm 10% thì gần như không",
      body: "Không phải lượt tối ưu nào cũng đáng công. Một chương trình 300 lệnh IR chỉ gấp được 10% hằng số và không có lệnh chết nào để bỏ, nên còn 270 lệnh. Tốc độ tăng là 300 chia 270, khoảng 1,11 lần, thấp hơn ngưỡng 1,5 lần, vì vậy kết luận là chưa đáng kể. Đổi lại, người ta phải trả giá bằng thời gian biên dịch dài hơn và nguy cơ sinh lỗi mới. Bài học là hãy đo trước khi tối ưu: nếu chương trình dành phần lớn thời gian chờ đọc đĩa hoặc mạng, việc bớt 30 lệnh không cứu được tốc độ.",
      focus: ["ir", "fold", "clock", "warn"],
      edges: ["ir-fold", "gen-clock", "clock-warn"],
      metrics: { ir: "300", fold: "10%", dead: "0%", speed: "1,1 lần" },
      changes: ["300 lệnh chỉ giảm còn 270", "Kết luận chuyển sang chưa đáng kể"],
      note: "Ngưỡng 1,5 lần giúp tránh những lượt tối ưu tốn công mà lợi ích không thấy được."
    },
    {
      short: "Tổng kết",
      type: "final",
      tone: "final",
      title: "Đo trước, tối ưu sau",
      body: "Tổng kết: tối ưu là chuỗi lượt biến đổi trên IR, mỗi lượt phải giữ nguyên hành vi của chương trình. Gấp hằng và bỏ mã chết là hai lượt cơ bản nhất; trên chương trình 200 lệnh, chúng đưa số lệnh xuống 80, tức nhanh 2,5 lần. Với 120 lệnh và hai tỉ lệ 40%, 25%, kết quả là 54 lệnh và 2,2 lần. Ngược lại, 300 lệnh chỉ giảm 10% còn 270 lệnh, tương đương 1,1 lần, dưới ngưỡng 1,5 nên chưa đáng kể. Bài sau đi vào cấp phát thanh ghi, nơi quyết định chương trình có giữ được tốc độ ấy khi chạy thật.",
      focus: "all",
      edges: "all",
      metrics: { ir: "80", fold: "50%", dead: "20%", speed: "2,5 lần" },
      changes: ["Chốt bộ ba kết quả 80, 54 và 270 lệnh", "Sẵn sàng sang bài cấp phát thanh ghi"],
      note: "Nhớ công thức: lệnh cuối bằng lệnh gốc nhân từng hệ số còn lại."
    }
  ]
};

window.COMPILERLAB.lessons["register"] = {
  id: "register",
  module: "toi-uu-va-sinh-ma",
  title: "Cấp phát thanh ghi",
  shortTitle: "Thanh ghi",
  subtitle: "Khoảng sống, đồ thị xung đột và tràn bộ nhớ",
  blurb: "Thanh ghi là chỗ nhanh nhất trong máy nhưng số lượng ít. Bài đi từ khoảng sống của biến, đồ thị xung đột, phép tô màu gán thanh ghi đến tình huống tràn ra bộ nhớ và cái giá của nó trong vòng lặp nóng.",
  duration: "12 phút",
  level: "Trung cấp",
  tags: ["thanh ghi", "khoảng sống", "đồ thị", "tô màu", "tràn"],
  metrics: [
    { key: "vars", label: "Biến sống", tone: "blue" },
    { key: "regs", label: "Thanh ghi", tone: "mint" },
    { key: "spill", label: "Tràn", tone: "yellow" },
    { key: "cycles", label: "Chu kỳ nạp", tone: "coral" }
  ],
  nodes: [
    { id: "expr", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Biến trong mã", sub: "40 biến của chương trình" },
    { id: "live", type: "clock", x: 340, y: 80, w: 200, h: 70, label: "Khoảng sống", sub: "từ định nghĩa tới dùng" },
    { id: "graph", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Đồ thị xung đột", sub: "hai biến sống chồng nhau" },
    { id: "color", type: "key", x: 340, y: 195, w: 200, h: 70, label: "Tô màu đồ thị", sub: "mỗi màu một thanh ghi" },
    { id: "regs", type: "memory", x: 55, y: 310, w: 200, h: 70, label: "Thanh ghi", sub: "16 thanh ghi khả dụng" },
    { id: "spill", type: "disk", x: 340, y: 310, w: 200, h: 70, label: "Tràn ra bộ nhớ", sub: "nạp lại tốn 4 chu kỳ" },
    { id: "hot", type: "bolt", x: 625, y: 310, w: 200, h: 70, label: "Vòng lặp nóng", sub: "ưu tiên giữ trong thanh ghi" }
  ],
  edges: [
    { id: "expr-live", from: "expr", to: "live", kind: "data", label: "tính khoảng sống" },
    { id: "live-graph", from: "live", to: "graph", kind: "data", label: "thêm cạnh" },
    { id: "graph-color", from: "graph", to: "color", kind: "request", label: "tô màu" },
    { id: "color-regs", from: "color", to: "regs", kind: "response", label: "gán thanh ghi" },
    { id: "color-spill", from: "color", to: "spill", kind: "control", label: "hết màu" },
    { id: "spill-hot", from: "spill", to: "hot", kind: "control", label: "nạp lại mỗi vòng" },
    { id: "regs-hot", from: "regs", to: "hot", kind: "data", label: "giữ biến nóng" }
  ],
  learn: [
    "Khoảng sống của biến tính từ lệnh định nghĩa đến lệnh dùng cuối.",
    "Hai biến sống chồng nhau thì nối một <code>cạnh xung đột</code>.",
    "Tô màu đồ thị bằng số màu bằng số <code>thanh ghi</code> khả dụng.",
    "Hết màu thì <code>tràn</code> ra bộ nhớ, mỗi lần nạp tốn thêm chu kỳ."
  ],
  steps: [
    {
      short: "Khoảng sống",
      type: "concept",
      title: "Biến sống từ đâu tới đâu",
      body: "Một biến chỉ cần thanh ghi trong khoảng thời gian nó còn giá trị sử dụng. Chương trình mẫu có 40 biến, nhưng tại mỗi thời điểm chỉ khoảng 12 biến cùng sống. Khoảng sống bắt đầu ở lệnh gán giá trị và kết thúc ở lệnh đọc cuối cùng. Nếu biến <code>tong</code> được gán ở dòng 3 và đọc lần cuối ở dòng 9, nó sống suốt 6 lệnh giữa hai mốc đó. Tính đúng khoảng sống là bước nền của mọi quyết định cấp phát: biến chết rồi thì thanh ghi của nó được trao cho biến khác, không cần thêm tài nguyên.",
      focus: ["expr", "live", "graph"],
      edges: ["expr-live", "live-graph"],
      metrics: { vars: "40", regs: "16", spill: "0", cycles: "0" },
      changes: ["40 biến được gắn khoảng sống", "Chỉ 12 biến sống đồng thời"],
      note: "Khoảng sống càng ngắn thì áp lực lên thanh ghi càng thấp."
    },
    {
      short: "Xung đột",
      type: "flow",
      title: "Nối cạnh giữa hai biến chồng nhau",
      body: "Từ 40 khoảng sống, trình biên dịch dựng đồ thị xung đột: mỗi biến là một đỉnh, hai biến có khoảng sống chồng nhau thì nối một cạnh vì chúng không thể dùng chung thanh ghi. Đồ thị mẫu có 40 đỉnh và khoảng 96 cạnh. Cách dựng rất máy móc, chỉ cần so từng cặp khoảng sống, nên dễ kiểm thử. Hình dạng đồ thị cho biết mức khó của bài toán: đồ thị thưa thì tô màu nhanh, đồ thị dày đặc như một cụm biến trong vòng lặp thì gần như chắc chắn phải tràn.",
      focus: ["live", "graph", "color"],
      edges: ["live-graph", "graph-color"],
      metrics: { vars: "40", regs: "16", spill: "0", cycles: "0" },
      changes: ["Đồ thị có 40 đỉnh, 96 cạnh", "Nhận diện cụm biến dày trong vòng lặp"],
      note: "Hai biến không bao giờ sống cùng lúc thì dùng chung một thanh ghi là hợp lệ."
    },
    {
      short: "Tô màu",
      type: "detail",
      title: "16 màu cho 40 biến",
      body: "Cấp phát thanh ghi chính là bài toán tô màu đồ thị với số màu cố định. Kiến trúc mẫu có 16 thanh ghi đa dụng, nên mỗi màu tương ứng một thanh ghi. Bộ tô màu tham lam xét đỉnh có bậc cao trước, thử các màu còn trống và gán màu đầu tiên hợp lệ. Với đồ thị mẫu, 37 biến nhận được thanh ghi, 3 biến còn lại không còn màu nào trống. Con số 3 không phải lỗi: đồ thị có cụm 17 biến sống chồng nhau, nhiều hơn 16 thanh ghi nên chắc chắn phải có biến nằm ngoài. Kết quả được ghi lại thành bảng ánh xạ biến sang thanh ghi.",
      focus: ["graph", "color", "regs"],
      edges: ["graph-color", "color-regs"],
      metrics: { vars: "40", regs: "16", spill: "3", cycles: "4" },
      changes: ["37 biến được gán thanh ghi", "3 biến không còn màu trống"],
      note: "Số màu ít hơn bậc lớn nhất của đồ thị thì tràn là điều tất yếu."
    },
    {
      short: "Tràn",
      type: "pitfall",
      title: "Một lần tràn, nghìn chu kỳ",
      body: "Ba biến không có thanh ghi bị đẩy xuống ngăn xếp, mỗi lần đọc phải nạp lại từ bộ nhớ, tốn thêm 4 chu kỳ. Nếu ba biến ấy nằm trong vòng lặp chạy 1.000 lần, chi phí phụ là 3 × 4 × 1.000, tức 12.000 chu kỳ, gấp 150 lần thân vòng lặp chỉ 80 chu kỳ. Vì vậy bộ cấp phát tốt luôn ưu tiên biến nóng: biến dùng nhiều trong vòng lặp được giữ trong thanh ghi, còn biến chỉ dùng một lần ở nhánh lạnh thì tràn cũng không sao. Đừng tối ưu theo số lần tràn mà theo số chu kỳ mất thêm.",
      focus: ["spill", "hot", "regs", "color"],
      edges: ["color-spill", "spill-hot", "regs-hot"],
      metrics: { vars: "40", regs: "16", spill: "3", cycles: "12.000" },
      changes: ["3 biến tràn nằm trong vòng lặp nóng", "Chi phí phụ lên tới 12.000 chu kỳ"],
      note: "Tràn ở nhánh lạnh gần như miễn phí, tràn trong vòng lặp nóng thì rất đắt."
    },
    {
      short: "Tổng kết",
      type: "final",
      tone: "final",
      title: "Chỗ nhanh nhất có hạn",
      body: "Tổng kết: cấp phát thanh ghi biến chương trình thành đồ thị, rồi tô màu bằng đúng số thanh ghi của kiến trúc đích. Chương trình mẫu có 40 biến, tối đa 12 biến sống cùng lúc, nhưng có cụm 17 biến chồng nhau nên với 16 thanh ghi vẫn phải tràn 3 biến. Ba lần tràn trong vòng lặp 1.000 vòng ngốn 12.000 chu kỳ, đủ để xóa sạch lợi ích của việc giảm từ 200 xuống 80 lệnh. Bài sau đi tiếp sang chọn lệnh máy, nơi mỗi phép toán IR được dịch thành một hoặc vài opcode cụ thể.",
      focus: "all",
      edges: "all",
      metrics: { vars: "40", regs: "16", spill: "3", cycles: "12.000" },
      changes: ["Chốt 37 biến có thanh ghi, 3 biến tràn", "Thấy chi phí tràn trong vòng lặp nóng"],
      note: "Cấp phát tốt không phải dùng nhiều thanh ghi mà là giữ đúng biến nóng."
    }
  ]
};

window.COMPILERLAB.lessons["codegen"] = {
  id: "codegen",
  module: "toi-uu-va-sinh-ma",
  title: "Chọn lệnh máy",
  shortTitle: "Sinh mã",
  subtitle: "Ánh xạ IR sang opcode, lịch lệnh và peephole",
  blurb: "Sinh mã là bước dịch từng lệnh IR thành lệnh của kiến trúc đích. Bài so sánh các cách chọn lệnh cho cùng một phép cộng, xếp lịch để tránh khe trễ, rồi gộp cặp lệnh thừa bằng peephole trước khi ghi tệp thực thi.",
  duration: "12 phút",
  level: "Trung cấp",
  tags: ["opcode", "chọn lệnh", "lịch lệnh", "peephole", "hợp ngữ"],
  metrics: [
    { key: "ops", label: "Lệnh máy", tone: "blue" },
    { key: "regs", label: "Toán hạng", tone: "mint" },
    { key: "latency", label: "Độ trễ", tone: "yellow" },
    { key: "size", label: "Kích thước", tone: "coral" }
  ],
  nodes: [
    { id: "ir", type: "code", x: 55, y: 80, w: 200, h: 70, label: "IR ba địa chỉ", sub: "80 lệnh sau tối ưu" },
    { id: "isel", type: "bolt", x: 340, y: 80, w: 200, h: 70, label: "Chọn lệnh", sub: "ánh xạ sang opcode" },
    { id: "order", type: "clock", x: 625, y: 80, w: 200, h: 70, label: "Lịch lệnh", sub: "tránh khe trễ 3 chu kỳ" },
    { id: "reg", type: "memory", x: 340, y: 195, w: 200, h: 70, label: "Gán thanh ghi", sub: "theo bảng đã cấp phát" },
    { id: "asm", type: "file", x: 55, y: 310, w: 200, h: 70, label: "Hợp ngữ", sub: "add, load, store" },
    { id: "peep", type: "audit", x: 340, y: 310, w: 200, h: 70, label: "Peephole", sub: "soi 3 lệnh liền nhau" },
    { id: "bin", type: "server", x: 625, y: 310, w: 200, h: 70, label: "Tệp thực thi", sub: "104 lệnh, 416 byte" }
  ],
  edges: [
    { id: "ir-isel", from: "ir", to: "isel", kind: "request", label: "từng lệnh IR" },
    { id: "isel-order", from: "isel", to: "order", kind: "data", label: "dãy opcode" },
    { id: "isel-reg", from: "isel", to: "reg", kind: "data", label: "toán hạng" },
    { id: "reg-asm", from: "reg", to: "asm", kind: "response", label: "phát lệnh" },
    { id: "order-asm", from: "order", to: "asm", kind: "control", label: "thứ tự chạy" },
    { id: "asm-peep", from: "asm", to: "peep", kind: "data", label: "dò mẫu" },
    { id: "peep-bin", from: "peep", to: "bin", kind: "response", label: "mã máy cuối" }
  ],
  learn: [
    "Mỗi lệnh IR có thể nở thành một hoặc vài <code>opcode</code>.",
    "Chọn lệnh tận dụng chế độ địa chỉ để bớt lệnh <code>load</code>.",
    "Lịch lệnh xếp lại để lấp khe trễ của pipeline.",
    "<code>Peephole</code> chỉ nhìn cửa sổ nhỏ nhưng bắt được nhiều cặp thừa."
  ],
  steps: [
    {
      short: "Ánh xạ",
      type: "concept",
      title: "Từ ba địa chỉ xuống opcode",
      body: "Sinh mã nhận 80 lệnh IR đã tối ưu và dịch từng lệnh sang lệnh của kiến trúc đích. IR ba địa chỉ cho phép toán hạng là biến, còn CPU chỉ làm việc với thanh ghi và bộ nhớ, nên mỗi phép toán thường cần thêm lệnh nạp. Với chương trình mẫu, 80 lệnh IR nở thành 118 lệnh máy. Phần dôi ra chủ yếu là <code>load</code> và <code>store</code> cho những biến chưa kịp nằm trong thanh ghi. Đây là lý do cấp phát thanh ghi ở bài trước quan trọng: giữ được biến trong thanh ghi thì bước sinh mã bớt hẳn một tầng lệnh.",
      focus: ["ir", "isel", "reg"],
      edges: ["ir-isel", "isel-reg"],
      metrics: { ops: "118", regs: "2", latency: "1", size: "472" },
      changes: ["80 lệnh IR thành 118 lệnh máy", "Phần dôi ra là load và store"],
      note: "Tỉ lệ nở khoảng 1,5 lần là bình thường với kiến trúc nạp rồi tính."
    },
    {
      short: "Chọn lệnh",
      type: "flow",
      title: "Một lệnh thay vì ba",
      body: "Cùng một phép cộng có nhiều cách viết. Với <code>t = tong + 4</code>, cách ngây thơ là <code>load eax, tong</code>, rồi <code>load ebx, 4</code>, rồi <code>add eax, ebx</code>, tổng ba lệnh. Cách tốt hơn dùng chế độ địa chỉ tức thì: <code>add eax, 4</code> chỉ một lệnh, vì hằng số 4 nằm sẵn trong mã lệnh. Bộ chọn lệnh duyệt cây biểu thức và ưu tiên mẫu ít lệnh nhất, đồng thời kiểm tra toán hạng có đúng thanh ghi hay không. Trên chương trình mẫu, nhờ chọn mẫu tốt mà tổng số lệnh giảm từ 118 xuống 112 trước khi xếp lịch.",
      focus: ["isel", "reg", "asm"],
      edges: ["ir-isel", "isel-reg", "reg-asm"],
      metrics: { ops: "112", regs: "2", latency: "1", size: "448" },
      changes: ["118 lệnh giảm còn 112", "Ba lệnh cộng gộp thành một lệnh add"],
      note: "Chế độ địa chỉ tức thì là công cụ rẻ nhất để giảm số lệnh."
    },
    {
      short: "Lịch lệnh",
      type: "detail",
      title: "Lấp khe trễ của pipeline",
      body: "CPU hiện đại không chờ lệnh trước xong mới chạy lệnh sau, nhưng kết quả phép cộng chỉ sẵn sau 3 chu kỳ. Nếu lệnh kế tiếp đọc ngay kết quả đó, pipeline phải dừng và chèn khe trễ. Bộ xếp lịch nhìn cửa sổ các lệnh độc lập rồi hoán đổi vị trí: đưa lệnh <code>load</code> hoặc lệnh không liên quan vào giữa để lấp khe. Trên chương trình mẫu, sau khi xếp lịch, số khe trễ giảm từ 24 xuống 6, tương đương tiết kiệm 54 chu kỳ. Việc hoán đổi chỉ hợp lệ khi hai lệnh thật sự độc lập, nếu không sẽ làm sai kết quả.",
      focus: ["order", "isel", "asm"],
      edges: ["isel-order", "order-asm"],
      metrics: { ops: "112", regs: "2", latency: "3", size: "448" },
      changes: ["Khe trễ giảm từ 24 xuống 6", "Tiết kiệm 54 chu kỳ chờ"],
      note: "Xếp lịch không bớt lệnh, nó chỉ làm các lệnh chờ ít hơn."
    },
    {
      short: "Peephole",
      type: "pitfall",
      title: "Cặp lệnh thừa",
      body: "Sau khi phát lệnh, bộ peephole quét từng cửa sổ ba lệnh liền nhau và thay mẫu xấu bằng mẫu tốt. Ví dụ <code>mov eax, ebx</code> rồi <code>mov ebx, eax</code> là cặp vô nghĩa, còn <code>store</code> ngay sau <code>load</code> cùng địa chỉ thì bỏ được một lệnh. Trên chương trình mẫu, peephole bỏ 8 lệnh, đưa 112 xuống 104 lệnh và kích thước còn 416 byte, mỗi lệnh 4 byte. Cạm bẫy là quét quá rộng: cửa sổ vài chục lệnh sẽ chậm và dễ sai, nên người ta giữ cửa sổ nhỏ rồi lặp vài lượt.",
      focus: ["asm", "peep", "bin"],
      edges: ["asm-peep", "peep-bin"],
      metrics: { ops: "104", regs: "2", latency: "3", size: "416" },
      changes: ["112 lệnh còn 104 sau peephole", "Kích thước giảm còn 416 byte"],
      note: "Peephole đơn giản nhưng hiệu quả vì mã do máy sinh thường lặp mẫu."
    },
    {
      short: "Tổng kết",
      type: "final",
      tone: "final",
      title: "Ba bước của một bộ sinh mã",
      body: "Tổng kết: sinh mã gồm chọn lệnh, xếp lịch và dọn bằng peephole. Từ 80 lệnh IR, bước chọn lệnh cho ra 118 lệnh máy, chọn mẫu tốt hơn kéo xuống 112, xếp lịch cắt 18 khe trễ tương đương 54 chu kỳ, và peephole bỏ 8 lệnh thừa để còn 104 lệnh, 416 byte. Chuỗi này cho thấy tối ưu không dừng ở IR: cùng một chương trình, cách chọn lệnh và thứ tự phát lệnh quyết định tốc độ thực tế. Bài cuối đi vào thời gian chạy và bộ nhớ để trả lời câu hỏi khó nhất: những con số này nghĩa là gì với người dùng.",
      focus: "all",
      edges: "all",
      metrics: { ops: "104", regs: "2", latency: "3", size: "416" },
      changes: ["Chốt 104 lệnh máy, 416 byte", "Nối kết quả sinh mã với chi phí chạy"],
      note: "Mỗi bước sinh mã đều có thể đo được, nên hãy đo trước khi đổi mẫu."
    }
  ]
};

window.COMPILERLAB.lessons["runtime"] = {
  id: "runtime",
  module: "toi-uu-va-sinh-ma",
  title: "Thời gian chạy và bộ nhớ",
  shortTitle: "Thời gian chạy",
  subtitle: "Chu kỳ, cache và cái giá của một lần trượt",
  blurb: "Mã máy nhanh hay chậm còn tùy dữ liệu nằm ở đâu. Bài đếm chu kỳ cho 80 lệnh đã tối ưu, tính chi phí một lần trượt cache, rồi chỉ ra vì sao ba biến tràn có thể xóa sạch lợi ích biên dịch.",
  duration: "12 phút",
  level: "Trung cấp",
  tags: ["chu kỳ", "cache", "bộ nhớ", "đo đạc", "nút cổ chai"],
  metrics: [
    { key: "ops", label: "Lệnh chạy", tone: "blue" },
    { key: "cycles", label: "Chu kỳ", tone: "mint" },
    { key: "miss", label: "Trượt cache", tone: "yellow" },
    { key: "stack", label: "Ngăn xếp", tone: "coral" }
  ],
  nodes: [
    { id: "bin", type: "server", x: 55, y: 80, w: 200, h: 70, label: "Mã máy", sub: "80 lệnh đã tối ưu" },
    { id: "cpu", type: "bolt", x: 340, y: 80, w: 200, h: 70, label: "CPU 3 GHz", sub: "một chu kỳ mỗi lệnh" },
    { id: "cache", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Cache L1", sub: "32 KB, đọc 4 chu kỳ" },
    { id: "prof", type: "clock", x: 340, y: 195, w: 200, h: 70, label: "Đo thời gian", sub: "đếm chu kỳ thật" },
    { id: "stack", type: "memory", x: 55, y: 310, w: 200, h: 70, label: "Ngăn xếp", sub: "khung 64 byte mỗi hàm" },
    { id: "ram", type: "disk", x: 625, y: 310, w: 200, h: 70, label: "Bộ nhớ chính", sub: "100 chu kỳ một lần đọc" },
    { id: "neck", type: "alert", x: 340, y: 310, w: 200, h: 70, label: "Nút cổ chai", sub: "chờ bộ nhớ nhiều hơn tính" }
  ],
  edges: [
    { id: "bin-cpu", from: "bin", to: "cpu", kind: "request", label: "nạp lệnh" },
    { id: "cpu-cache", from: "cpu", to: "cache", kind: "request", label: "đọc dữ liệu" },
    { id: "cache-ram", from: "cache", to: "ram", kind: "response", label: "nạp khối 64 byte" },
    { id: "cpu-stack", from: "cpu", to: "stack", kind: "data", label: "tham số và biến" },
    { id: "prof-cpu", from: "prof", to: "cpu", kind: "control", label: "đếm chu kỳ" },
    { id: "cpu-neck", from: "cpu", to: "neck", kind: "control", label: "chờ bộ nhớ" },
    { id: "neck-ram", from: "neck", to: "ram", kind: "data", label: "đo độ trễ" }
  ],
  learn: [
    "80 lệnh, mỗi lệnh một chu kỳ, chạy hết <code>80 chu kỳ</code>.",
    "Một lần trượt cache tốn khoảng <code>100 chu kỳ</code> chờ bộ nhớ.",
    "Ngăn xếp giữ khung hàm, biến tràn cũng nằm ở đó.",
    "Tối ưu chỉ đáng khi nút cổ chai nằm trong phần được sửa."
  ],
  steps: [
    {
      short: "Đếm chu kỳ",
      type: "concept",
      title: "80 lệnh là 80 chu kỳ",
      body: "Sau khi tối ưu và sinh mã, chương trình mẫu còn 80 lệnh máy. Với CPU 3 GHz và giả định lý tưởng một chu kỳ mỗi lệnh, thân chương trình chạy hết 80 chu kỳ, tương đương khoảng 26,7 nano giây. Con số này nhỏ đến mức khó tin, và đó chính là điểm cần hiểu: thời gian thật hiếm khi bằng số lệnh nhân chu kỳ. Mỗi lệnh còn phải nạp từ bộ nhớ, chờ dữ liệu và tranh chấp tài nguyên với lệnh khác. Đếm chu kỳ lý tưởng chỉ là mốc so sánh, không phải dự đoán thời gian chạy thật.",
      focus: ["bin", "cpu", "prof"],
      edges: ["bin-cpu", "prof-cpu"],
      metrics: { ops: "80", cycles: "80", miss: "0", stack: "64 byte" },
      changes: ["80 lệnh chạy hết 80 chu kỳ", "Mốc lý tưởng khoảng 26,7 nano giây"],
      note: "Số lệnh nhân chu kỳ chỉ là giới hạn dưới, không phải thời gian thật."
    },
    {
      short: "Cache",
      type: "flow",
      title: "Một lần trượt tốn 100 chu kỳ",
      body: "Dữ liệu nằm trong cache L1 thì CPU đọc mất 4 chu kỳ, còn trượt xuống bộ nhớ chính thì mất khoảng 100 chu kỳ. Chương trình mẫu có 5 lần trượt cache trên đường nóng, nên tổng thời gian là 80 chu kỳ tính toán cộng 5 lần chờ, tức khoảng 580 chu kỳ, gấp hơn 7 lần mốc lý tưởng. Một mảng 32 KB vừa cache L1 sẽ chạy mượt, còn mảng 32 MB thì gần như mỗi lần đọc đều trượt. Đây là lý do duyệt mảng theo hàng ngang nhanh hơn duyệt theo cột dù số phép toán như nhau.",
      focus: ["cpu", "cache", "ram", "neck"],
      edges: ["cpu-cache", "cache-ram", "cpu-neck", "neck-ram"],
      metrics: { ops: "80", cycles: "580", miss: "5", stack: "64 byte" },
      changes: ["5 lần trượt cache thêm 500 chu kỳ", "Tổng thời gian thành 580 chu kỳ"],
      note: "Cache L1 đọc 4 chu kỳ, bộ nhớ chính khoảng 100 chu kỳ, chênh 25 lần."
    },
    {
      short: "Ngăn xếp",
      type: "detail",
      title: "Khung hàm và biến tràn",
      body: "Mỗi lần gọi hàm, CPU đẩy một khung 64 byte lên ngăn xếp để giữ tham số, địa chỉ trả về và biến cục bộ. Ba biến bị tràn thanh ghi ở bài trước cũng nằm trong khung này, nên mỗi lần đọc phải đi qua ngăn xếp rồi có thể trượt cache. Nếu hàm được gọi 1.000 lần trong vòng lặp, chi phí 12.000 chu kỳ tính ở bài cấp phát thanh ghi sẽ cộng thêm chi phí nạp khung. Đệ quy sâu còn tệ hơn: 10.000 lần gọi với khung 64 byte cần 640 KB ngăn xếp, vượt giới hạn mặc định 8 MB chỉ sau vài chục nghìn tầng nếu khung phình to.",
      focus: ["cpu", "stack", "neck"],
      edges: ["cpu-stack", "cpu-neck"],
      metrics: { ops: "80", cycles: "580", miss: "5", stack: "64 byte" },
      changes: ["Mỗi lần gọi tốn khung 64 byte", "Biến tràn làm tăng số lần chạm ngăn xếp"],
      note: "Ngăn xếp nhanh nhưng vẫn là bộ nhớ, nên khung càng lớn càng dễ trượt cache."
    },
    {
      short: "So sánh",
      type: "pitfall",
      title: "Nhanh 2,2 lần nhưng vẫn chờ",
      body: "Ở bài tối ưu, chương trình 120 lệnh giảm còn 54 lệnh, tức nhanh 2,2 lần. Nhưng nếu 54 lệnh ấy vẫn phải chờ 5 lần trượt cache, thời gian thực tế chỉ giảm từ 620 xuống 554 chu kỳ, chưa tới 1,2 lần. Ngược lại, một chương trình 80 lệnh nằm gọn trong cache có thể nhanh hơn hẳn chương trình 54 lệnh nhưng dữ liệu rải rác. Kết luận thực dụng: hãy đo bằng bộ đếm chu kỳ thật, xác định nút cổ chai nằm ở tính toán, cache hay băng thông bộ nhớ, rồi mới chọn lượt tối ưu. Tối ưu mù quáng chỉ làm báo cáo đẹp hơn.",
      focus: ["bin", "cpu", "cache", "neck", "prof"],
      edges: ["bin-cpu", "cpu-cache", "prof-cpu", "cpu-neck"],
      metrics: { ops: "54", cycles: "554", miss: "5", stack: "64 byte" },
      changes: ["Giảm lệnh chỉ còn 1,2 lần nhanh thực tế", "Nút cổ chai chuyển sang chờ bộ nhớ"],
      note: "Giảm số lệnh không tự động giảm thời gian chờ dữ liệu."
    },
    {
      short: "Tổng kết",
      type: "final",
      tone: "final",
      title: "Con số cuối cùng là thời gian",
      body: "Tổng kết: tối ưu và sinh mã chỉ có ý nghĩa khi nhìn qua lăng kính thời gian chạy. Chương trình mẫu 80 lệnh cần 80 chu kỳ nếu mọi thứ nằm trong cache, nhưng 5 lần trượt đẩy lên 580 chu kỳ. Con số 54 lệnh nhanh 2,2 lần trên giấy chỉ còn khoảng 1,2 lần khi dữ liệu phải chờ bộ nhớ. Vì vậy quy trình đúng là đo, tìm nút cổ chai, rồi mới sửa: giữ biến nóng trong thanh ghi, xếp dữ liệu theo thứ tự duyệt, và đừng đánh đổi cache để lấy vài lệnh ít hơn.",
      focus: "all",
      edges: "all",
      metrics: { ops: "80", cycles: "580", miss: "5", stack: "64 byte" },
      changes: ["Chốt 80 lệnh, 580 chu kỳ, 5 lần trượt", "Kết luận đo trước rồi mới tối ưu"],
      note: "Kết thúc module: từ 200 lệnh IR đến 80 lệnh máy, nhưng thời gian mới là thước đo."
    }
  ]
};

window.COMPILERLAB.practice.push(
  {
    id: "cc-practice-optimize",
    module: "toi-uu-va-sinh-ma",
    tag: "OPTIMIZE",
    title: "Hai lượt tối ưu cộng dồn thế nào",
    scenario: "Nhóm của bạn nhận một trình biên dịch nhỏ cho bài tập lớn. Chương trình mẫu có 200 lệnh IR, lượt gấp hằng xử lý 50% số lệnh, lượt bỏ mã chết dọn thêm 20% tính trên phần còn lại. Trưởng nhóm muốn biết sau hai lượt còn bao nhiêu lệnh và tốc độ tăng có đáng kể hay không, vì tài liệu nội bộ ghi ngưỡng 1,5 lần mới được coi là đáng kể. Một bạn trong nhóm cộng thẳng hai tỉ lệ thành 70% và báo còn 60 lệnh. Bạn được giao kiểm tra lại con số trước khi nộp báo cáo.",
    metrics: [
      { label: "Lệnh IR", value: "200" },
      { label: "Gấp hằng", value: "50%" },
      { label: "Bỏ mã chết", value: "20%" }
    ],
    options: [
      "Còn 80 lệnh, nhanh 2,5 lần, đáng kể",
      "Còn 60 lệnh, nhanh 3,3 lần, đáng kể",
      "Còn 100 lệnh, nhanh 2,0 lần, chưa đáng kể",
      "Còn 80 lệnh, nhanh 1,2 lần, chưa đáng kể"
    ],
    correct: 0,
    explain: "Hai lượt tối ưu nhân với nhau chứ không cộng: <code>200 × 0,5 × 0,8 = 80</code> lệnh. Tốc độ tăng là 200 chia 80, đúng 2,5 lần, vượt ngưỡng 1,5 lần nên kết luận là đáng kể. Phương án 60 lệnh sai vì cộng 50% với 20% thành 70%, trong khi lượt bỏ mã chết chỉ tính trên 100 lệnh còn lại. Phương án 100 lệnh chỉ dừng sau lượt gấp hằng, bỏ sót lượt thứ hai. Phương án cuối đúng số lệnh nhưng sai tốc độ: 200 chia 80 không thể ra 1,2 lần. Khi báo cáo, hãy ghi cả công thức để người đọc đối chiếu."
  },
  {
    id: "cc-practice-codegen",
    module: "toi-uu-va-sinh-ma",
    tag: "CODEGEN",
    title: "Chọn dãy lệnh cho một phép cộng",
    scenario: "Bạn viết bộ sinh mã cho kiến trúc nạp rồi tính, nơi mọi phép toán phải có ít nhất một toán hạng là thanh ghi. Trong vòng lặp tính tiền, câu lệnh IR là t = tong + 4, với tong đã nằm trong thanh ghi eax. Người hướng dẫn yêu cầu bản dịch ngắn nhất mà vẫn đúng, đồng thời nhắc rằng mỗi lệnh thêm làm chương trình chậm thêm một chu kỳ và tốn thêm 4 byte. Một bạn đề xuất nạp hằng số 4 vào thanh ghi phụ rồi cộng hai thanh ghi. Bạn cần chọn dãy lệnh hợp lý nhất trước khi nộp bản sinh mã.",
    metrics: [
      { label: "Lệnh IR", value: "1" },
      { label: "Chi phí", value: "1 chu kỳ" },
      { label: "Kích thước", value: "4 byte" }
    ],
    options: [
      "load eax, tong rồi load ebx, 4 rồi add eax, ebx",
      "add eax, 4",
      "mul eax, 4",
      "mov eax, 4 rồi add eax, eax"
    ],
    correct: 1,
    explain: "Đáp án đúng là <code>add eax, 4</code> vì kiến trúc cho phép hằng số nằm ngay trong mã lệnh, gọi là chế độ địa chỉ tức thì. Một lệnh vừa đọc eax, vừa cộng 4, vừa ghi kết quả lại, đúng bằng một chu kỳ và 4 byte. Phương án đầu dịch đúng nghĩa nhưng tốn ba lệnh vì nạp lại biến đã có trong thanh ghi, làm chậm thêm hai chu kỳ. Phương án nhân thay đổi hẳn kết quả: nhân với 4 khác cộng với 4. Phương án cuối ghi đè eax bằng 4 rồi tự cộng, mất giá trị tong và cũng sai kết quả. Chọn mẫu lệnh ngắn nhất là việc của bộ chọn lệnh, không phải của người viết IR."
  }
);

window.COMPILERLAB.cheatsheets.push({
  id: "backend",
  num: "03",
  module: "toi-uu-va-sinh-ma",
  title: "Tối ưu và sinh mã",
  intro: "Bảng tra cho chặng cuối của trình biên dịch: bốn lượt tối ưu trên IR, công thức tính tốc độ tăng, bảng chọn lệnh máy, checklist cấp phát thanh ghi và chi phí bộ nhớ khi chạy thật.",
  cards: [
    {
      title: "Bốn lượt tối ưu trên IR",
      wide: true,
      html: "<table><thead><tr><th>Lượt</th><th>Làm gì</th><th>Ví dụ</th><th>Giảm</th></tr></thead><tbody><tr><td>Gấp hằng</td><td>Tính biểu thức tĩnh lúc biên dịch</td><td><code>x = 6 * 7</code> thành <code>x = 42</code></td><td>50%</td></tr><tr><td>Bỏ mã chết</td><td>Xóa lệnh không thể tới hoặc không ai đọc</td><td>nhánh <code>if (2 &gt; 1)</code></td><td>20%</td></tr><tr><td>Lan truyền hằng</td><td>Thay biến bằng giá trị đã biết</td><td><code>k = 3</code> rồi dùng <code>k</code></td><td>tùy mã</td></tr><tr><td>Gộp lệnh</td><td>Hai phép toán thành một</td><td><code>a * 2</code> thành <code>a + a</code></td><td>5-10%</td></tr></tbody></table>"
    },
    {
      title: "Công thức tốc độ",
      html: "<pre><code>lệnh cuối = IR × (1 - gấp) × (1 - chết)\ntốc độ   = IR / lệnh cuối\n\n200 × 0,5 × 0,8 = 80  → 2,5 lần\n120 × 0,6 × 0,75 = 54 → 2,2 lần\n300 × 0,9 × 1,0 = 270 → 1,1 lần\n\nđáng kể khi tốc độ &gt;= 1,5 lần</code></pre>"
    },
    {
      title: "Chọn lệnh IR sang hợp ngữ",
      wide: true,
      html: "<table><thead><tr><th>IR</th><th>Cách ngắn</th><th>Lệnh máy</th></tr></thead><tbody><tr><td><code>t = a + 4</code></td><td>toán hạng tức thì</td><td><code>add eax, 4</code></td></tr><tr><td><code>t = a + b</code></td><td>hai thanh ghi</td><td><code>add eax, ebx</code></td></tr><tr><td><code>t = m[i]</code></td><td>địa chỉ cơ sở cộng chỉ số</td><td><code>mov eax, [esi + ecx*4]</code></td></tr><tr><td><code>if a &lt; b</code></td><td>so sánh rồi nhảy</td><td><code>cmp eax, ebx</code> + <code>jl</code></td></tr></tbody></table>"
    },
    {
      title: "Checklist cấp phát thanh ghi",
      html: "<ul><li>Tính khoảng sống từ lệnh gán đến lần đọc cuối.</li><li>Nối cạnh xung đột cho mọi cặp sống chồng nhau.</li><li>Tô màu với số màu bằng số thanh ghi khả dụng.</li><li>Hết màu thì tràn ra ngăn xếp, mỗi lần nạp khoảng 4 chu kỳ.</li><li>Ưu tiên giữ biến nóng trong vòng lặp, tràn biến ở nhánh lạnh.</li></ul>"
    },
    {
      title: "Chi phí khi chạy thật",
      wide: true,
      html: "<table><thead><tr><th>Tài nguyên</th><th>Chi phí</th><th>Ghi chú</th></tr></thead><tbody><tr><td>Thanh ghi</td><td>0 chu kỳ chờ</td><td>chỉ có 16 thanh ghi đa dụng</td></tr><tr><td>Cache L1</td><td>4 chu kỳ</td><td>32 KB, nhanh nhất trong bộ nhớ</td></tr><tr><td>Bộ nhớ chính</td><td>khoảng 100 chu kỳ</td><td>một lần trượt cache</td></tr><tr><td>Khung hàm</td><td>64 byte ngăn xếp</td><td>tăng theo độ sâu đệ quy</td></tr></tbody></table>"
    }
  ]
});
