import {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

function Documents() {
  const [documents, setDocuments] =
    useState([]);

  const [uploading, setUploading] =
    useState(false);

  const fetchDocuments =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "nexamind_token"
          );

        const res = await fetch(
          "http://localhost:5000/api/documents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await res.json();

        setDocuments(
          data.documents ||
            data.data ||
            data ||
            []
        );
      } catch {
        setDocuments([]);
      }
    };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload =
    async (e) => {
      const files =
        Array.from(
          e.target.files
        );

      for (const file of files) {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        setUploading(true);

        try {
          const token =
            localStorage.getItem(
              "nexamind_token"
            );

          const res =
            await fetch(
              "http://localhost:5000/api/documents/upload",
              {
                method:
                  "POST",

                headers: {
                  Authorization: `Bearer ${token}`,
                },

                body: formData,
              }
            );

          const data =
            await res.json();

          if (data.success) {
            alert(
              `✅ ${file.name} uploaded successfully!`
            );

            fetchDocuments();
          } else {
            alert(
              `❌ Upload failed: ${data.message}`
            );
          }
        } catch (err) {
          alert(
            `❌ Server error. Make sure backend is running on port 5000.`
          );
        } finally {
          setUploading(false);
        }
      }
    };

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          color="#fff"
        >
          Documents
        </Typography>

        <Button
          variant="contained"
          component="label"
          disabled={uploading}
        >
          {uploading ? (
            <CircularProgress
              size={20}
              sx={{
                color: "#fff",
              }}
            />
          ) : (
            "UPLOAD FILE"
          )}

          <input
            hidden
            multiple
            type="file"
            onChange={
              handleFileUpload
            }
          />
        </Button>
      </Stack>

      <Stack spacing={2}>
        {documents.map((doc) => (
          <Card
            key={doc._id}
            sx={{
              bgcolor:
                "#11111B",
              border:
                "1px solid rgba(108,99,255,0.1)",
            }}
          >
            <CardContent>
              <Typography
                color="#fff"
                fontWeight={700}
              >
                {doc.title ||
                  doc.filename}
              </Typography>

              <Typography
                sx={{
                  color:
                    "rgba(255,255,255,0.5)",
                  mt: 1,
                }}
              >
                {doc.type ||
                  "PDF"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default Documents;