
const { db, createApp, asyncHandler, integer, start } = require("./sample_common");

const app = createApp();

// 메뉴 목록 조회
app.get("/", asyncHandler(async (req, res) => {
    const [menus] = await db.execute(
        "SELECT id, name, price, category FROM menus ORDER BY id DESC"
    );

    res.render("index", {
        menus,
        editMenu: null
    });
}));

// 메뉴 추가
app.post("/menus/add", asyncHandler(async (req, res) => {
    const name = (req.body.name || "").trim();
    const price = integer(req.body.price);
    const category = (req.body.category || "").trim();

    if (!name || price === null || price < 0 || !category) {
        return res.status(400).send("메뉴 정보를 올바르게 입력해주세요.");
    }

    await db.execute(
        "INSERT INTO menus (name, price, category) VALUES (?, ?, ?)",
        [name, price, category]
    );

    res.redirect("/");
}));

// 메뉴 수정 화면
app.get("/menus/edit/:id", asyncHandler(async (req, res) => {
    const id = integer(req.params.id);

    if (id === null || id <= 0) {
        return res.status(400).send("잘못된 메뉴 번호입니다.");
    }

    const [menus] = await db.execute(
        "SELECT id, name, price, category FROM menus WHERE id = ?",
        [id]
    );

    if (menus.length === 0) {
        return res.status(404).send("메뉴를 찾을 수 없습니다.");
    }

    const [allMenus] = await db.execute(
        "SELECT id, name, price, category FROM menus ORDER BY id DESC"
    );

    res.render("index", {
        menus: allMenus,
        editMenu: menus[0]
    });
}));

// 메뉴 수정
app.post("/menus/update/:id", asyncHandler(async (req, res) => {
    const id = integer(req.params.id);
    const name = (req.body.name || "").trim();
    const price = integer(req.body.price);
    const category = (req.body.category || "").trim();

    if (
        id === null || id <= 0 ||
        !name || price === null || price < 0 || !category
    ) {
        return res.status(400).send("수정 정보를 올바르게 입력해주세요.");
    }

    const [result] = await db.execute(
        "UPDATE menus SET name = ?, price = ?, category = ? WHERE id = ?",
        [name, price, category, id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).send("수정할 메뉴를 찾을 수 없습니다.");
    }

    res.redirect("/");
}));

// 메뉴 삭제
app.post("/menus/delete/:id", asyncHandler(async (req, res) => {
    const id = integer(req.params.id);

    if (id === null || id <= 0) {
        return res.status(400).send("잘못된 메뉴 번호입니다.");
    }

    await db.execute(
        "DELETE FROM menus WHERE id = ?",
        [id]
    );

    res.redirect("/");
}));

start(app, "Cafe Menu Management");
