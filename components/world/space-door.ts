import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
} from "three";

export const SPACE_DOOR_NAME = "space-door";

const DOOR_W = 2.8;
const DOOR_H = 6.2;
const DOOR_D = 0.36;
const CASING = 0.44;

type DoorMaterials = {
  slab: MeshStandardMaterial;
  casing: MeshStandardMaterial;
  molding: MeshStandardMaterial;
  recess: MeshStandardMaterial;
  hardware: MeshStandardMaterial;
};

function doorMaterial(
  color: number,
  opts: { roughness?: number; metalness?: number; emissiveIntensity?: number } = {}
) {
  return new MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.84,
    metalness: opts.metalness ?? 0.05,
    emissive: 0x08080a,
    emissiveIntensity: opts.emissiveIntensity ?? 0.28,
  });
}

function createMaterials(): DoorMaterials {
  return {
    slab: doorMaterial(0xf5f5f4, { roughness: 0.9 }),
    casing: doorMaterial(0xe7e5e4, { roughness: 0.88 }),
    molding: doorMaterial(0xefeeec, { roughness: 0.82 }),
    recess: doorMaterial(0xe2e0de, { roughness: 0.94 }),
    hardware: doorMaterial(0xc8cdd4, {
      roughness: 0.26,
      metalness: 0.94,
      emissiveIntensity: 0.06,
    }),
  };
}

function addBox(
  parent: Group,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  material: MeshStandardMaterial
) {
  const mesh = new Mesh(new BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

/** One recessed panel with raised molding — classic 4-panel door field. */
function addRecessedPanel(
  parent: Group,
  cx: number,
  cy: number,
  pw: number,
  ph: number,
  faceZ: number,
  outward: 1 | -1,
  moldT: number,
  recessDepth: number,
  mats: DoorMaterials
) {
  const moldD = 0.055;
  const zMold = faceZ;
  const zField = faceZ - outward * recessDepth;

  // Raised molding frame
  addBox(parent, pw, moldT, moldD, cx, cy + ph / 2 - moldT / 2, zMold, mats.molding);
  addBox(parent, pw, moldT, moldD, cx, cy - ph / 2 + moldT / 2, zMold, mats.molding);
  addBox(parent, moldT, ph, moldD, cx - pw / 2 + moldT / 2, cy, zMold, mats.molding);
  addBox(parent, moldT, ph, moldD, cx + pw / 2 - moldT / 2, cy, zMold, mats.molding);

  // Recessed panel field
  const fieldW = pw - moldT * 2.2;
  const fieldH = ph - moldT * 2.2;
  addBox(parent, fieldW, fieldH, moldD * 0.55, cx, cy, zField, mats.recess);
}

/** 2×2 panel grid — tall upper pair, shorter lower pair. */
function addFourPanelFace(
  parent: Group,
  outward: 1 | -1,
  mats: DoorMaterials
) {
  const faceZ = outward * (DOOR_D / 2 + 0.004);
  const moldT = 0.09;
  const recessDepth = 0.048;

  const marginX = 0.2;
  const marginY = 0.22;
  const centerStile = 0.11;
  const midRail = 0.13;
  const edgeRailH = marginY * 0.85;

  const innerTop = DOOR_H / 2 - marginY;
  const innerBottom = -DOOR_H / 2 + marginY;
  const panelTop = innerTop - edgeRailH;
  const panelBottom = innerBottom + edgeRailH;
  const panelAreaH = panelTop - panelBottom;

  const innerW = DOOR_W - marginX * 2;
  const colW = (innerW - centerStile) / 2;
  const topH = panelAreaH * 0.56;
  const botH = panelAreaH - topH - midRail;

  const botY = panelBottom + botH / 2;
  const topY = panelBottom + botH + midRail + topH / 2;
  const leftX = -colW / 2 - centerStile / 2;
  const rightX = colW / 2 + centerStile / 2;

  const panels: [number, number, number, number][] = [
    [leftX, topY, colW, topH],
    [rightX, topY, colW, topH],
    [leftX, botY, colW, botH],
    [rightX, botY, colW, botH],
  ];

  for (const [cx, cy, pw, ph] of panels) {
    addRecessedPanel(parent, cx, cy, pw, ph, faceZ, outward, moldT, recessDepth, mats);
  }

  // Center stile + horizontal rails (raised)
  const railD = 0.05;
  const stileH = panelTop - panelBottom;
  addBox(parent, centerStile, stileH, railD, 0, (panelTop + panelBottom) / 2, faceZ, mats.molding);
  addBox(
    parent,
    innerW,
    midRail,
    railD,
    0,
    panelBottom + botH + midRail / 2,
    faceZ,
    mats.molding
  );
  addBox(
    parent,
    innerW,
    edgeRailH,
    railD,
    0,
    innerTop - edgeRailH / 2,
    faceZ,
    mats.molding
  );
  addBox(
    parent,
    innerW,
    edgeRailH,
    railD,
    0,
    innerBottom + edgeRailH / 2,
    faceZ,
    mats.molding
  );
}

/** Lever handle + round backplate on one face. */
function addLeverHandle(
  parent: Group,
  outward: 1 | -1,
  mats: DoorMaterials
) {
  const x = -DOOR_W * 0.27;
  const y = -DOOR_H * 0.04;
  const baseZ = outward * (DOOR_D / 2 + 0.02);

  const plate = new Mesh(
    new CylinderGeometry(0.19, 0.19, 0.035, 24),
    mats.hardware
  );
  plate.rotation.x = Math.PI / 2;
  plate.position.set(x, y, baseZ + outward * 0.02);
  parent.add(plate);

  addBox(parent, 0.34, 0.07, 0.07, x + 0.17, y, baseZ + outward * 0.07, mats.hardware);
  addBox(parent, 0.08, 0.11, 0.08, x + 0.02, y, baseZ + outward * 0.08, mats.hardware);
}

function buildDoorLeaf(mats: DoorMaterials) {
  const leaf = new Group();

  // Outer casing — simplified architrave
  addBox(
    leaf,
    DOOR_W + CASING * 2,
    DOOR_H + CASING * 2,
    DOOR_D * 0.72,
    0,
    0,
    0,
    mats.casing
  );
  addBox(
    leaf,
    DOOR_W + CASING * 2.6,
    CASING * 0.95,
    DOOR_D * 0.78,
    0,
    DOOR_H / 2 + CASING * 0.62,
    0,
    mats.casing
  );

  // Solid slab
  addBox(leaf, DOOR_W, DOOR_H, DOOR_D, 0, 0, 0, mats.slab);

  // Four-panel faces — front (+Z) and back (−Z)
  addFourPanelFace(leaf, 1, mats);
  addFourPanelFace(leaf, -1, mats);

  addLeverHandle(leaf, 1, mats);
  addLeverHandle(leaf, -1, mats);

  return leaf;
}

/** Small white door placed far from the globe — visible drifting in the starfield. */
export function createSpaceDoor() {
  const door = new Group();
  door.name = SPACE_DOOR_NAME;

  const mats = createMaterials();
  door.add(buildDoorLeaf(mats));

  const fill = new PointLight(0xdce4f0, 1.15, 140);
  fill.position.set(0, 0.5, 6);
  door.add(fill);

  const hitZone = new Mesh(
    new BoxGeometry(DOOR_W * 5, DOOR_H * 5, DOOR_D * 14),
    new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  );
  hitZone.name = "space-door-hit";
  door.add(hitZone);

  door.position.set(520, 95, -410);
  door.lookAt(0, 0, 0);
  door.rotateY(0.35);
  door.rotateZ(0.06);

  return door;
}

export function disposeSpaceDoor(door: Group) {
  door.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.geometry.dispose();
    const { material } = obj;
    if (Array.isArray(material)) {
      material.forEach((m) => m.dispose());
    } else {
      material.dispose();
    }
  });
}
