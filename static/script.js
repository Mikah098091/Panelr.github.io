// ---------------- THEME ----------------
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
};


// ---------------- GENERATE OFFSETS ----------------
document.getElementById("generateOffsets").onclick = async () => {
    const payload = {
        count: parseInt(count.value),
        min: parseInt(minOffset.value),
        max: parseInt(maxOffset.value)
    };

    const res = await fetch("/random_offsets", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    const arr = await res.json();
    offsetEditor.value = arr.join(",");
};


// ---------------- RENDER PNG ----------------
document.getElementById("renderBtn").onclick = async () => {
    let offsets = offsetEditor.value.split(",")
        .map(x => parseInt(x.trim()))
        .filter(v => !isNaN(v));

    if (offsets.length === 0) {
        alert("No offsets!");
        return;
    }

    const payload = {
        offsets,
        room_w: parseFloat(roomW.value),
        room_l: parseFloat(roomL.value),
        panel_w: parseFloat(panelW.value),
        panel_l: parseFloat(panelL.value)
    };

    const res = await fetch("/generate_layout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    const blob = await res.blob();
    previewImg.src = URL.createObjectURL(blob);
};


// ---------------- EXPORT DXF ----------------
document.getElementById("exportDXF").onclick = async () => {
    let offsets = offsetEditor.value.split(",")
        .map(x => parseInt(x.trim()))
        .filter(v => !isNaN(v));

    if (offsets.length === 0) {
        alert("No offsets!");
        return;
    }

    const payload = {
        offsets,
        room_w: parseFloat(roomW.value),
        room_l: parseFloat(roomL.value),
        panel_w: parseFloat(panelW.value),
        panel_l: parseFloat(panelL.value)
    };

    const res = await fetch("/export_dxf", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "panel_layout.dxf";
    a.click();
};


// ---------------- CSV UPLOAD ----------------
document.getElementById("offsetFile").onchange = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    let form = new FormData();
    form.append("file", file);

    let res = await fetch("/upload_csv", {
        method: "POST",
        body: form
    });

    let arr = await res.json();
    offsetEditor.value = arr.join(",");
};


// ---------------- DOWNLOAD CSV ----------------
document.getElementById("downloadCSV").onclick = async () => {
    let offsets = offsetEditor.value.split(",")
        .map(x => parseInt(x.trim()))
        .filter(v => !isNaN(v));

    const res = await fetch("/download_csv", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({offsets})
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "offsets.csv";
    a.click();
};
