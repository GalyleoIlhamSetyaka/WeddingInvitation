// ============================
// SUPABASE CONFIG
// ============================
const SUPABASE_URL = "https://glavxxjldmqblmqprrjm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_EFPajlJloc2vpUPCZMeZRQ_1CH-bXae";

const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ============================
// OVERRIDE COMMENT SEND
// ============================
undangan.comment.send = async function () {
  const nameEl = document.getElementById("form-name");
  const presenceEl = document.getElementById("form-presence");
  const messageEl = document.getElementById("form-comment");

  if (!nameEl || !presenceEl || !messageEl) {
    alert("Form komentar tidak ditemukan");
    return;
  }

  const name = nameEl.value.trim();
  const presence = parseInt(presenceEl.value);
  const message = messageEl.value.trim();

  if (!name || !message || presence === 0) {
    alert("Nama, presensi, dan ucapan wajib diisi");
    return;
  }

  const { error } = await sb.from("comments").insert({
    name: name,
    presence: presence,
    message: message
  });

  if (error) {
    console.error(error);
    alert("Gagal mengirim ucapan");
    return;
  }

  messageEl.value = "";
  loadComments();
};

// ============================
// LOAD COMMENTS
// ============================
async function loadComments() {
  const container = document.getElementById("comments");
  if (!container) return;

  const { data, error } = await sb
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "<p class='text-center text-danger'>Gagal memuat komentar</p>";
    return;
  }

  if (!data.length) {
    container.innerHTML = "<p class='text-center text-muted'>Belum ada ucapan</p>";
    return;
  }

  container.innerHTML = "";

  data.forEach(c => {
    container.innerHTML += `
      <div class="border-bottom pb-2 mb-2">
        <strong>${c.name}</strong>
        <span class="badge ms-2 ${c.presence == 1 ? "bg-success" : "bg-danger"}">
          ${c.presence == 1 ? "Hadir" : "Berhalangan"}
        </span>
        <p class="mb-1 mt-1">${c.message}</p>
        <small class="text-muted">
          ${new Date(c.created_at).toLocaleString("id-ID")}
        </small>
      </div>
    `;
  });
}

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
  loadComments();
});
