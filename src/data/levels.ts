import { LevelConfig, CellType, Direction, BlockType } from '../types';

/**
 * Helper to build an empty grid filled with EMPTY grass cells
 */
function createGrid(width: number, height: number, defaultType: CellType = 'EMPTY'): CellType[][] {
  const grid: CellType[][] = [];
  for (let y = 0; y < height; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < width; x++) {
      row.push(defaultType);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Generate 80 high-quality progressive levels across 5 worlds:
 * World 1: Basic Movement (1-15)
 * World 2: Collect Object (16-30)
 * World 3: Loop / Repeat (31-45)
 * World 4: Condition / If (46-60)
 * World 5: Maze Mastery (61-80)
 */
function generateAllLevels(): LevelConfig[] {
  const levels: LevelConfig[] = [];

  // ==========================================
  // DUNIA 1: GERAKAN DASAR (LEVEL 1 - 15)
  // ==========================================
  const d1Allowed: BlockType[] = ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT'];

  // Level 1: Langkah Pertama
  {
    const grid = createGrid(5, 5);
    for (let x = 1; x <= 3; x++) grid[2][x] = 'PATH';
    levels.push({
      id: 1,
      worldId: 1,
      worldLevelNumber: 1,
      title: 'Langkah Pertama',
      concept: 'Urutan Gerak Lurus',
      instructions: 'Susun blok "Maju" sebanyak 2 kali agar Robot Kiko melangkah lurus menuju bendera!',
      hint: 'Robot sudah menghadap ke kanan (Timur). Cukup gunakan 2 blok Maju.',
      gridSize: { width: 5, height: 5 },
      startPos: { x: 1, y: 2 },
      startDir: 'RIGHT',
      goalPos: { x: 3, y: 2 },
      grid,
      stars: [],
      optimalBlocks: 2,
      allowedBlocks: d1Allowed,
    });
  }

  // Level 2: Berbelok ke Kanan
  {
    const grid = createGrid(5, 5);
    grid[1][1] = 'PATH';
    grid[1][2] = 'PATH';
    grid[1][3] = 'PATH';
    grid[2][3] = 'PATH';
    grid[3][3] = 'PATH';
    levels.push({
      id: 2,
      worldId: 1,
      worldLevelNumber: 2,
      title: 'Belok ke Kanan',
      concept: 'Orientasi & Putaran',
      instructions: 'Maju lurus, lalu putar robot ke kanan (Selatan) dan teruskan langkah ke bendera!',
      hint: 'Maju 2 kali -> Belok Kanan -> Maju 2 kali.',
      gridSize: { width: 5, height: 5 },
      startPos: { x: 1, y: 1 },
      startDir: 'RIGHT',
      goalPos: { x: 3, y: 3 },
      grid,
      stars: [],
      optimalBlocks: 5,
      allowedBlocks: d1Allowed,
    });
  }

  // Level 3: Jalur Berbelok Kiri
  {
    const grid = createGrid(5, 5);
    grid[3][1] = 'PATH';
    grid[3][2] = 'PATH';
    grid[2][2] = 'PATH';
    grid[1][2] = 'PATH';
    grid[1][3] = 'PATH';
    levels.push({
      id: 3,
      worldId: 1,
      worldLevelNumber: 3,
      title: 'Tikungan Tajam Kiri',
      concept: 'Belok Kiri & Navigasi',
      instructions: 'Bimbing Kiko maju, berbelok kiri ke arah atas, lalu belok kanan ke arah bendera!',
      hint: 'Maju 1 kali -> Belok Kiri -> Maju 2 kali -> Belok Kanan -> Maju 1 kali.',
      gridSize: { width: 5, height: 5 },
      startPos: { x: 1, y: 3 },
      startDir: 'RIGHT',
      goalPos: { x: 3, y: 1 },
      grid,
      stars: [],
      optimalBlocks: 6,
      allowedBlocks: d1Allowed,
    });
  }

  // Level 4: Menghindari Semak Rintangan
  {
    const grid = createGrid(5, 5);
    grid[2][1] = 'PATH';
    grid[1][1] = 'PATH';
    grid[1][2] = 'PATH';
    grid[1][3] = 'PATH';
    grid[2][3] = 'PATH';
    grid[2][2] = 'OBSTACLE'; // obstacle in the middle
    levels.push({
      id: 4,
      worldId: 1,
      worldLevelNumber: 4,
      title: 'Hindari Rintangan',
      concept: 'Memilih Rute Aman',
      instructions: 'Ada batu dan semak di tengah! Putar robot ke atas dan lewati jalur melingkar.',
      hint: 'Belok Kiri -> Maju 1 -> Belok Kanan -> Maju 2 -> Belok Kanan -> Maju 1.',
      gridSize: { width: 5, height: 5 },
      startPos: { x: 1, y: 2 },
      startDir: 'RIGHT',
      goalPos: { x: 3, y: 2 },
      grid,
      stars: [],
      optimalBlocks: 6,
      allowedBlocks: d1Allowed,
    });
  }

  // Level 5: Jalan Zig-Zag
  {
    const grid = createGrid(5, 5);
    grid[1][1] = 'PATH';
    grid[1][2] = 'PATH';
    grid[2][2] = 'PATH';
    grid[2][3] = 'PATH';
    grid[3][3] = 'PATH';
    levels.push({
      id: 5,
      worldId: 1,
      worldLevelNumber: 5,
      title: 'Tangga Zig-Zag',
      concept: 'Pola Langkah Berulang',
      instructions: 'Susun langkah menyerupai anak tangga: maju, belok, maju, belok.',
      hint: 'Maju 1 -> Belok Kanan -> Maju 1 -> Belok Kiri -> Maju 1 -> Belok Kanan -> Maju 1.',
      gridSize: { width: 5, height: 5 },
      startPos: { x: 1, y: 1 },
      startDir: 'RIGHT',
      goalPos: { x: 3, y: 3 },
      grid,
      stars: [],
      optimalBlocks: 7,
      allowedBlocks: d1Allowed,
    });
  }

  // Levels 6 - 15 (World 1 progressively longer paths, 5x5 to 6x6 grids)
  for (let i = 6; i <= 15; i++) {
    const size = i > 10 ? 6 : 5;
    const grid = createGrid(size, size);
    const startX = 1;
    const startY = 1;
    let goalX = size - 2;
    let goalY = size - 2;

    // Draw snake/spiral path
    for (let x = startX; x <= goalX; x++) grid[startY][x] = 'PATH';
    for (let y = startY; y <= goalY; y++) grid[y][goalX] = 'PATH';
    if (i % 2 === 0) {
      grid[goalY][goalX - 1] = 'PATH';
      goalX = goalX - 1;
    }

    // Add decorative obstacles around
    grid[startY + 1][startX] = 'OBSTACLE';

    levels.push({
      id: i,
      worldId: 1,
      worldLevelNumber: i,
      title: `Petualangan Rute ${i}`,
      concept: `Navigasi Grid ${size}x${size}`,
      instructions: `Eksplorasi langkah robot menuju bendera finish di petak (${goalX}, ${goalY}) tanpa menabrak tepi.`,
      hint: 'Hitung jumlah petak lurus terlebih dahulu sebelum memutar robot.',
      gridSize: { width: size, height: size },
      startPos: { x: startX, y: startY },
      startDir: 'RIGHT',
      goalPos: { x: goalX, y: goalY },
      grid,
      stars: [],
      optimalBlocks: 4 + (i % 5),
      allowedBlocks: d1Allowed,
    });
  }

  // ==========================================
  // DUNIA 2: KUMPULKAN BINTANG (LEVEL 16 - 30)
  // ==========================================
  const d2Allowed: BlockType[] = ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'PICK_STAR', 'JUMP'];

  for (let i = 16; i <= 30; i++) {
    const lvlNum = i - 15;
    const size = lvlNum > 8 ? 6 : 5;
    const grid = createGrid(size, size);

    // Create a path with 1 to 3 stars
    const pathCoords: { x: number; y: number }[] = [];
    const startX = 1;
    const startY = 1;

    // build a path
    for (let x = 1; x < size - 1; x++) {
      grid[1][x] = 'PATH';
      pathCoords.push({ x, y: 1 });
    }
    for (let y = 2; y < size - 1; y++) {
      grid[y][size - 2] = 'PATH';
      pathCoords.push({ x: size - 2, y });
    }

    // place 1 to 3 stars
    const starsCount = lvlNum <= 5 ? 1 : lvlNum <= 10 ? 2 : 3;
    const stars: { x: number; y: number }[] = [];

    if (starsCount >= 1 && pathCoords[2]) {
      stars.push({ x: pathCoords[2].x, y: pathCoords[2].y });
    }
    if (starsCount >= 2 && pathCoords[pathCoords.length - 2]) {
      stars.push({ x: pathCoords[pathCoords.length - 2].x, y: pathCoords[pathCoords.length - 2].y });
    }
    if (starsCount >= 3 && pathCoords[1]) {
      stars.push({ x: pathCoords[1].x, y: pathCoords[1].y });
    }

    const goal = pathCoords[pathCoords.length - 1];

    levels.push({
      id: i,
      worldId: 2,
      worldLevelNumber: lvlNum,
      title: `Koleksi Bintang ${lvlNum}`,
      concept: `Aksi Mengambil ${stars.length} Bintang`,
      instructions: `Gunakan blok "Ambil Bintang" saat Robot Kiko berada persis di petak berbintang sebelum mencapai bendera!`,
      hint: 'Pastikan robot berdiri di petak bintang sebelum memanggil "Ambil Bintang".',
      gridSize: { width: size, height: size },
      startPos: { x: startX, y: startY },
      startDir: 'RIGHT',
      goalPos: { x: goal.x, y: goal.y },
      grid,
      stars,
      optimalBlocks: 5 + stars.length * 2,
      allowedBlocks: d2Allowed,
    });
  }

  // ==========================================
  // DUNIA 3: PERULANGAN / LOOP (LEVEL 31 - 45)
  // ==========================================
  const d3Allowed: BlockType[] = ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'PICK_STAR', 'REPEAT', 'JUMP'];

  for (let i = 31; i <= 45; i++) {
    const lvlNum = i - 30;
    const size = lvlNum > 8 ? 7 : 6;
    const grid = createGrid(size, size);

    // Create repetitive patterns: e.g. 4 steps forward or 3-step repeat
    const repCount = Math.min(2 + Math.floor(lvlNum / 3), 4);
    const startX = 1;
    const startY = 1;

    // Pattern: zig-zag or spiral
    let curX = startX;
    let curY = startY;
    grid[curY][curX] = 'PATH';

    for (let r = 0; r < repCount; r++) {
      if (curX + 1 < size - 1) {
        curX++;
        grid[curY][curX] = 'PATH';
      }
      if (curY + 1 < size - 1) {
        curY++;
        grid[curY][curX] = 'PATH';
      }
    }

    const stars: { x: number; y: number }[] = [];
    if (lvlNum % 2 === 0 && curX > 2) {
      stars.push({ x: curX - 1, y: curY - 1 });
    }

    levels.push({
      id: i,
      worldId: 3,
      worldLevelNumber: lvlNum,
      title: `Loop Perulangan ${lvlNum}`,
      concept: `Pola Berulang (${repCount} Kali)`,
      instructions: `Gunakan blok "Ulangi ${repCount} Kali" agar kamu tidak perlu menumpuk puluhan blok secara manual!`,
      hint: `Cari potongan aksi yang sama berulang-ulang, lalu masukkan ke dalam blok Ulangi ${repCount} Kali.`,
      gridSize: { width: size, height: size },
      startPos: { x: startX, y: startY },
      startDir: 'RIGHT',
      goalPos: { x: curX, y: curY },
      grid,
      stars,
      optimalBlocks: 3 + (stars.length > 0 ? 2 : 0), // Very few blocks because of loop!
      allowedBlocks: d3Allowed,
    });
  }

  // ==========================================
  // DUNIA 4: PERCABANGAN / CONDITION (LEVEL 46 - 60)
  // ==========================================
  const d4Allowed: BlockType[] = ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'PICK_STAR', 'IF_OBSTACLE', 'IF_STAR', 'REPEAT'];

  for (let i = 46; i <= 60; i++) {
    const lvlNum = i - 45;
    const size = 6;
    const grid = createGrid(size, size);

    // A straight or slightly curving road with obstacles or water gaps
    const startX = 1;
    const startY = 2;
    grid[startY][startX] = 'PATH';

    for (let x = 1; x <= 4; x++) {
      grid[startY][x] = 'PATH';
    }

    // Place obstacle on x=3
    grid[startY][3] = 'OBSTACLE';

    const stars: { x: number; y: number }[] = [];
    if (lvlNum > 5) {
      stars.push({ x: 2, y: startY });
    }

    levels.push({
      id: i,
      worldId: 4,
      worldLevelNumber: lvlNum,
      title: `Logika Keputusan ${lvlNum}`,
      concept: 'Percabangan IF (Jika Ada Rintangan)',
      instructions: 'Ada batu menghalangi jalan! Gunakan blok "Jika Ada Rintangan -> Lompat" atau belok memutari rute.',
      hint: 'Blok percabangan IF mendeteksi petak di depan robot secara cerdas.',
      gridSize: { width: size, height: size },
      startPos: { x: startX, y: startY },
      startDir: 'RIGHT',
      goalPos: { x: 4, y: startY },
      grid,
      stars,
      optimalBlocks: 4 + stars.length,
      allowedBlocks: d4Allowed,
    });
  }

  // ==========================================
  // DUNIA 5: LABIRIN MASTER (LEVEL 61 - 80)
  // ==========================================
  const d5Allowed: BlockType[] = [
    'MOVE_FORWARD',
    'TURN_LEFT',
    'TURN_RIGHT',
    'JUMP',
    'PICK_STAR',
    'REPEAT',
    'IF_OBSTACLE',
    'IF_STAR',
  ];

  for (let i = 61; i <= 80; i++) {
    const lvlNum = i - 60;
    const size = 7;
    const grid = createGrid(size, size);

    // Build rich maze paths
    const startX = 1;
    const startY = 1;
    let goalX = size - 2;
    let goalY = size - 2;

    // Outer corridor
    for (let x = 1; x <= size - 2; x++) grid[1][x] = 'PATH';
    for (let y = 1; y <= size - 2; y++) grid[y][size - 2] = 'PATH';
    for (let x = 2; x <= size - 3; x++) grid[size - 2][x] = 'PATH';

    // Maze hurdles
    grid[1][3] = 'OBSTACLE';
    grid[3][size - 2] = 'WATER'; // bridge or jumpable

    const stars: { x: number; y: number }[] = [
      { x: 2, y: 1 },
      { x: size - 2, y: 4 },
    ];

    levels.push({
      id: i,
      worldId: 5,
      worldLevelNumber: lvlNum,
      title: `Tantangan Labirin ${lvlNum}`,
      concept: 'Pemecahan Masalah Terintegrasi',
      instructions: `Gunakan seluruh keterampilan kodemu: Maju, Belok, Lompat melewati air/batu, dan kumpulkan bintang di labirin!`,
      hint: 'Amati pola jalur secara cermat dari garis start sampai ke bendera.',
      gridSize: { width: size, height: size },
      startPos: { x: startX, y: startY },
      startDir: 'RIGHT',
      goalPos: { x: 2, y: size - 2 },
      grid,
      stars,
      optimalBlocks: 8 + (lvlNum % 4),
      allowedBlocks: d5Allowed,
    });
  }

  return levels;
}

export const ALL_LEVELS: LevelConfig[] = generateAllLevels();

export function getLevelById(id: number): LevelConfig | undefined {
  return ALL_LEVELS.find((l) => l.id === id);
}

export function getLevelsByWorld(worldId: number): LevelConfig[] {
  return ALL_LEVELS.filter((l) => l.worldId === worldId);
}
