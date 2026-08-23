// "use client";

// import { UploadButton } from "@/lib/uploadthing";

// export default function Home() {
//   return (
//     <main className="flex flex-col justify-between items-center p-24 min-h-screen">
//       <UploadButton
//         endpoint="imageUploader"
//         onClientUploadComplete={(res) => {
//           // Do something with the response
//           console.log("Files: ", res);
//           alert("Upload Completed");
//         }}
//         onUploadError={(error: Error) => {
//           // Do something with the error.
//           alert(`ERROR! ${error.message}`);
//         }}
//       />
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";

export default function Home() {
  // Upload ပြီးရင် ရလာမယ့် URL ကို သိမ်းထားဖို့ State
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <main className="flex flex-col justify-between items-center p-24 min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log("Files: ", res);
            if (res && res[0]) {
              // UploadThing v7+ မှာ res[0].ufsUrl သို့မဟုတ် res[0].url ပါပါတယ်
              setImageUrl(res[0].ufsUrl ?? res[0].url);
            }
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />

        {/* Upload ပြီးရင် Image ကို UI မှာ ပြန် render ပြမယ့်နေရာ */}
        {imageUrl && (
          <div className="flex flex-col items-center mt-6">
            <p className="mb-2 font-semibold text-sm">Uploaded Image:</p>
            <div className="relative border rounded-lg w-64 h-64 overflow-hidden">
              <Image
                src={imageUrl}
                alt="Uploaded Image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
