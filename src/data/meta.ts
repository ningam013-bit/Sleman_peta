export const NOTES: Record<string, string> = {
  Moyudan: "Ujung barat daya, berbatasan dengan Kabupaten Kulon Progo.",
  Minggir: "Barat laut, di tepi Sungai Progo.",
  Seyegan: "Dataran barat, di antara Minggir, Godean, dan Tempel.",
  Godean: "Penghubung wilayah barat menuju Gamping dan Mlati.",
  Gamping: "Pintu barat daya yang menempel ke Kota Yogyakarta.",
  Mlati: "Selatan pusat kabupaten, berbatasan dengan Kota Yogyakarta.",
  Depok: "Kawasan selatan yang padat, termasuk UGM dan Bandara Adisutjipto.",
  Berbah: "Tenggara, berbatasan dengan Kabupaten Bantul.",
  Prambanan: "Ujung timur. Kompleks Candi Prambanan berdiri di sini.",
  Kalasan: "Timur kabupaten, di antara Depok, Berbah, dan Prambanan.",
  Ngemplak: "Timur laut, jalur dari Kalasan menuju lereng Merapi.",
  Ngaglik: "Utara Depok, jalur menuju Pakem dan Kaliurang.",
  Sleman: "Pusat pemerintahan Kabupaten Sleman.",
  Tempel: "Utara barat, berbatasan dengan Kabupaten Magelang.",
  Turi: "Lereng barat Merapi, sentra salak pondoh.",
  Pakem: "Lereng selatan Merapi dan gerbang Kaliurang.",
  Cangkringan: "Lereng tenggara Merapi. Kecamatan terluas di Sleman.",
};

export type Landmark = {
  name: string;
  kind: string;
  lat: number;
  lon: number;
};

/** Titik dari OpenStreetMap / Nominatim, hanya penanda orientasi. */
export const LANDMARKS: Landmark[] = [
  { name: "Candi Prambanan", kind: "Cagar budaya", lat: -7.7522269, lon: 110.4915331 },
  { name: "Candi Ratu Boko", kind: "Cagar budaya", lat: -7.770512, lon: 110.4894642 },
  { name: "Candi Sambisari", kind: "Cagar budaya", lat: -7.7623668, lon: 110.446949 },
  { name: "Bandara Adisutjipto", kind: "Transportasi", lat: -7.7845212, lon: 110.4357106 },
  { name: "Universitas Gadjah Mada", kind: "Pendidikan", lat: -7.7693966, lon: 110.3804236 },
  { name: "Kaliurang", kind: "Wisata", lat: -7.6005217, lon: 110.4256299 },
];
