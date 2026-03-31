"use client";

export default function FileUpload({ setFile }: any) {

  const handleFileChange = (e: any) => {
    const selected = e.target.files[0];

    if (!selected) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4"
    ];

    if (!validTypes.includes(selected.type)) {
      alert("Invalid file type");
      return;
    }

    setFile(selected);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">
        Upload Image / Video
      </label>

      <input
        type="file"
        accept="image/*,video/mp4"
        onChange={handleFileChange}
        className="w-full bg-[#1F2937] p-3 rounded"
      />
    </div>
  );
}
