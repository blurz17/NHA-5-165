import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import gradio as gr

FEATURES = [
    "Relative_Compactness", "Surface_Area", "Wall_Area", "Roof_Area",
    "Overall_Height", "Orientation", "Glazing_Area", "Glazing_Area_Distribution",
]
GEO = ["Relative_Compactness", "Surface_Area", "Wall_Area", "Roof_Area", "Overall_Height"]

pre = joblib.load("processed/preprocessor_tree.joblib")
m_heat = joblib.load("models/xgb_heating_load.joblib")
m_cool = joblib.load("models/xgb_cooling_load.joblib")

data = pd.concat([pd.read_csv("processed/train.csv"), pd.read_csv("processed/test.csv")], ignore_index=True)
shapes = (data[GEO].drop_duplicates()
          .sort_values("Relative_Compactness", ascending=False).reset_index(drop=True))
AVG_H, AVG_C = data.Heating_Load.mean(), data.Cooling_Load.mean()
Q = (data.Heating_Load + data.Cooling_Load).quantile([.2, .4, .6, .8]).values
GRADES = ["A", "B", "C", "D", "E"]
COLORS = {"A": "#16a34a", "B": "#65a30d", "C": "#ca8a04", "D": "#ea580c", "E": "#dc2626"}


def grade(total):
    return GRADES[int(np.searchsorted(Q, total))]


def predict_batch(df_in):
    X = pre.transform(df_in[FEATURES])
    return m_heat.predict(X), m_cool.predict(X)


# كل التصميمات الممكنة (768) محسوبة مرة واحدة
rows = []
for si, s in shapes.iterrows():
    for ori in (2, 3, 4, 5):
        for ga in (0.0, 0.1, 0.25, 0.4):
            for gd in ((0,) if ga == 0 else (1, 2, 3, 4, 5)):
                rows.append({**s.to_dict(), "Shape": si + 1, "Orientation": ori,
                             "Glazing_Area": ga, "Glazing_Area_Distribution": gd})
ALL = pd.DataFrame(rows)
_h, _c = predict_batch(ALL)
ALL["Heating"], ALL["Cooling"], ALL["Total"] = _h, _c, _h + _c
BEST = ALL.loc[ALL.Total.idxmin()]

SHAPE_CHOICES = [
    (f"Shape {i+1} · compactness {r.Relative_Compactness:.2f} · "
     f"{'Tall 7 m' if r.Overall_Height == 7 else 'Low 3.5 m'}", i)
    for i, r in shapes.iterrows()
]


def cards_html(h, c):
    t = h + c
    g = grade(t)
    col = COLORS[g]
    dh, dc = (h / AVG_H - 1) * 100, (c / AVG_C - 1) * 100
    save = t - BEST.Total
    return f"""
    <div class="grid">
      <div class="kpi"><div class="lbl">🔥 Heating Load</div><div class="val">{h:.2f}</div>
        <div class="sub">kWh/m² · {dh:+.0f}% vs average</div></div>
      <div class="kpi"><div class="lbl">❄️ Cooling Load</div><div class="val">{c:.2f}</div>
        <div class="sub">kWh/m² · {dc:+.0f}% vs average</div></div>
      <div class="kpi"><div class="lbl">⚡ Total Load</div><div class="val">{t:.2f}</div>
        <div class="sub">{save:.1f} kWh/m² above the best design</div></div>
      <div class="kpi" style="border-color:{col}"><div class="lbl">Efficiency Rating</div>
        <div class="val" style="color:{col}">{g}</div>
        <div class="sub">A = most efficient · E = least</div></div>
    </div>"""


def geo_html(s):
    return f"""
    <div class="geo"><b>🏗️ Building geometry (auto-filled)</b><br>
    Surface area: {s.Surface_Area} m² &nbsp;|&nbsp; Wall area: {s.Wall_Area} m² &nbsp;|&nbsp;
    Roof area: {s.Roof_Area} m² &nbsp;|&nbsp; Height: {s.Overall_Height} m</div>"""


def bar_fig(h, c):
    labels = ["Your design", "Dataset average", "Best possible"]
    H = [h, AVG_H, BEST.Heating]
    C = [c, AVG_C, BEST.Cooling]
    fig, ax = plt.subplots(figsize=(6, 3.6))
    ax.bar(labels, H, label="Heating", color="#f97316")
    ax.bar(labels, C, bottom=H, label="Cooling", color="#0ea5e9")
    for i, (a, b) in enumerate(zip(H, C)):
        ax.text(i, a + b + 0.5, f"{a + b:.1f}", ha="center", fontweight="bold")
    ax.set_ylabel("kWh/m²")
    ax.set_title("Total energy load comparison")
    ax.legend(frameon=False)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    return fig


def sens_fig(s, ori, ga, gd):
    gd_e = gd if gd > 0 else 3
    gl = (0.0, 0.1, 0.25, 0.4)
    rws = [{**s.to_dict(), "Orientation": ori, "Glazing_Area": g,
            "Glazing_Area_Distribution": 0 if g == 0 else gd_e} for g in gl]
    h, c = predict_batch(pd.DataFrame(rws))
    fig, ax = plt.subplots(figsize=(6, 3.6))
    ax.plot(gl, h, "o-", color="#f97316", label="Heating")
    ax.plot(gl, c, "o-", color="#0ea5e9", label="Cooling")
    ax.axvline(ga, ls="--", color="gray", alpha=.7)
    ax.set_xlabel("Glazing area (ratio of floor area)")
    ax.set_ylabel("kWh/m²")
    ax.set_title("Effect of glazing area on this building")
    ax.legend(frameon=False)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    return fig


def simulate(shape_i, ori, ga, gd):
    ga = float(ga)
    gd = 0 if ga == 0 else int(gd)
    ori = int(ori)
    s = shapes.iloc[int(shape_i)]
    row = {**s.to_dict(), "Orientation": ori, "Glazing_Area": ga, "Glazing_Area_Distribution": gd}
    h, c = predict_batch(pd.DataFrame([row]))
    h, c = float(h[0]), float(c[0])
    return cards_html(h, c), geo_html(s), bar_fig(h, c), sens_fig(s, ori, ga, gd)


def optimize(objective, max_glaz, height):
    d = ALL[ALL.Glazing_Area <= float(max_glaz)]
    if height != "Any":
        d = d[d.Overall_Height == float(height)]
    col = {"Total energy": "Total", "Heating only": "Heating", "Cooling only": "Cooling"}[objective]
    top = d.nsmallest(5, col).reset_index(drop=True)
    return pd.DataFrame({
        "Rank": range(1, len(top) + 1),
        "Shape": top.Shape.astype(int),
        "Compactness": top.Relative_Compactness,
        "Height (m)": top.Overall_Height,
        "Orientation": top.Orientation.astype(int),
        "Glazing": top.Glazing_Area,
        "Glazing Dist.": top.Glazing_Area_Distribution.astype(int),
        "Heating": top.Heating.round(2),
        "Cooling": top.Cooling.round(2),
        "Total": top.Total.round(2),
    })


CSS = """
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin:6px 0 10px}
.kpi{border-radius:16px;padding:16px 18px;background:rgba(20,184,166,.08);border:1.5px solid rgba(20,184,166,.35)}
.kpi .lbl{font-size:.85rem;opacity:.8}
.kpi .val{font-size:2.1rem;font-weight:800;line-height:1.2}
.kpi .sub{font-size:.75rem;opacity:.7}
.geo{padding:12px 16px;border-radius:12px;background:rgba(100,116,139,.12);margin-bottom:8px}
.hero{padding:26px 28px;border-radius:20px;color:white;margin-bottom:10px;
      background:linear-gradient(135deg,#0f766e,#0ea5e9)}
.hero h1{margin:0;font-size:2rem;color:white}
.hero p{margin:6px 0 0;opacity:.92}
"""

HERO = """
<div class="hero"><h1>🏢 Building Energy Efficiency Simulator</h1>
<p>Machine-learning model (XGBoost) that predicts a building's heating and cooling load
from its architectural design — before a single brick is laid.</p></div>"""

PERF = """
### Model results on the held-out test set

| Model | Target | MAE | RMSE | R² |
|---|---|---|---|---|
| Decision Tree | Heating | 0.4071 | 0.5873 | 0.9967 |
| Decision Tree | Cooling | 1.3253 | 2.2609 | 0.9448 |
| Random Forest | Heating | 0.3446 | 0.4919 | 0.9977 |
| Random Forest | Cooling | 1.1659 | 1.9043 | 0.9609 |
| Gradient Boosting | Heating | 0.3890 | 0.5212 | 0.9974 |
| Gradient Boosting | Cooling | 1.0075 | 1.4619 | 0.9769 |
| XGBoost (default) | Heating | 0.2731 | 0.4226 | 0.9983 |
| XGBoost (default) | Cooling | 0.4962 | 1.0150 | 0.9889 |
| **XGBoost (tuned)** | **Heating** | **0.2757** | **0.4177** | **0.9983** |
| **XGBoost (tuned)** | **Cooling** | **0.4124** | **0.7319** | **0.9942** |

The tuned XGBoost (RandomizedSearchCV, 5-fold CV on the training set) is the model behind this app.
"""

ABOUT = """
### About
- **Data:** 768 simulated residential buildings (12 shapes × orientations × glazing options).
- **Task:** regression with two targets: Heating Load and Cooling Load (kWh/m²).
- **Stack:** Python · scikit-learn · XGBoost · Gradient-boosted trees · Gradio.
- **Note:** predictions are only valid inside the ranges the model was trained on
  (the 12 building shapes and the glazing options offered here).
- **Rating:** A–E is based on the percentile of the total load across the dataset.
"""

with gr.Blocks(theme=gr.themes.Soft(primary_hue="teal"), css=CSS,
               title="Building Energy Simulator") as demo:
    gr.HTML(HERO)
    with gr.Tabs():
        with gr.Tab("🎛️ Simulator"):
            with gr.Row():
                with gr.Column(scale=1):
                    shape_in = gr.Dropdown(SHAPE_CHOICES, value=5, label="Building shape")
                    ori_in = gr.Radio([2, 3, 4, 5], value=3, label="Orientation")
                    ga_in = gr.Radio([0.0, 0.1, 0.25, 0.4], value=0.25, label="Glazing area")
                    gd_in = gr.Radio([1, 2, 3, 4, 5], value=3,
                                     label="Glazing distribution (ignored if glazing = 0)")
                    btn = gr.Button("Predict energy load", variant="primary")
                with gr.Column(scale=2):
                    cards = gr.HTML()
                    geo = gr.HTML()
                    with gr.Row():
                        bar = gr.Plot(label="Comparison")
                        sens = gr.Plot(label="Glazing sensitivity")
            ins = [shape_in, ori_in, ga_in, gd_in]
            outs = [cards, geo, bar, sens]
            btn.click(simulate, ins, outs)
            for comp in ins:
                comp.change(simulate, ins, outs)
            demo.load(simulate, ins, outs)

        with gr.Tab("🎯 Design Optimizer"):
            gr.Markdown("Search all 768 designs and get the 5 most energy-efficient ones.")
            with gr.Row():
                obj = gr.Radio(["Total energy", "Heating only", "Cooling only"],
                               value="Total energy", label="Minimize")
                mg = gr.Radio([0.0, 0.1, 0.25, 0.4], value=0.4, label="Max glazing area")
                hh = gr.Radio(["Any", "3.5", "7.0"], value="Any", label="Building height (m)")
            go = gr.Button("Find best designs", variant="primary")
            table = gr.Dataframe(interactive=False)
            go.click(optimize, [obj, mg, hh], table)
            demo.load(optimize, [obj, mg, hh], table)

        with gr.Tab("📊 Model Performance"):
            gr.Markdown(PERF)
            gr.Markdown("*(Feature importance: Surface_Area, Roof_Area and Relative_Compactness dominate.)*")

        with gr.Tab("ℹ️ About"):
            gr.Markdown(ABOUT)

if __name__ == "__main__":
    demo.launch()