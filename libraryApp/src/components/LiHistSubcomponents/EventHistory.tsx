import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";

const columns: GridColDef[] = [
  { field: "id", headerName: "Event ID", width: 70 },
  { field: "startTimestamp", headerName: "Start Time Stamp", width: 130 },
  { field: "endTimestamp", headerName: "End Time Stamp", width: 130 },
  {
    field: "ageGroup",
    headerName: "Age Group",
    type: "number",
    width: 90,
  },
  { field: "location", headerName: "Location", width: 130 },
  { field: "title", headerName: "Title", width: 130 },
  { field: "description", headerName: "Description", width: 130 },
  { field: "categoryId", headerName: "CategoryID", type: "number", width: 130 },
  { field: "isPrivate", headerName: "IsPrivate", type: "boolean", width: 130 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function EventHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Event`);
        if (!response.ok) {
          throw new Error("Failed to fetch donation data");
        }
        const data = await response.json();
        console.log("raw data: ", data);
        // Transform API response to fit DataGrid's row format
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const formattedData = data.map((event: any, index: number) => {
          //console.log("amount: ", donation.amount);
          return {
            ...event,
            id: event.eventId || index + 1, // Ensure unique ID
            startTimestamp: event.startTimestamp
              ? new Date(event.startTimestamp)
              : null,
            endTimestamp: event.endTimestamp
              ? new Date(event.startTimestamp)
              : null,
            location: event.location || "missing",
            ageGroup: event.ageGroup || -1,
            categoryId: event.categoryId || -1,
            isPrivate: event.isPrivate || false,
            description: event.description || "missing",
            title: event.title || "missing",
          };
        });
        console.log("formatted data: ", formattedData);
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[50, 100]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
