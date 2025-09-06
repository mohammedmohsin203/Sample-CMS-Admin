// Backend file

"use client";

import { useEffect, useState } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import Handsontable from "handsontable";

export default function AdminDashboard() {
    const [universities, setUniversities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [inspections, setInspections] = useState([]);
    const [activeTable, setActiveTable] = useState("universities");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [formData, setFormData] = useState({});

    // Fetch data
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const uniRes = await fetch("/api/universities");
        const empRes = await fetch("/api/employees");
        const inspRes = await fetch("/api/inspections");

        setUniversities(await uniRes.json());
        setEmployees(await empRes.json());
        setInspections(await inspRes.json());
    }

    // Data mapper
    const getData = () => {
        switch (activeTable) {
            case "employees":
                return employees.map((e) => ({
                    id: e.id,
                    name: e.name,
                    department: e.department,
                    Update: "", Delete: ""
                }));
            case "inspections":
                return inspections.map((i) => ({
                    id: i.id,
                    universityId: i.universityId,
                    employeeId: i.employeeId,
                    inspectedAt: i.inspectedAt,
                    Update: "", Delete: ""
                }));
            default:
                return universities.map((u) => ({
                    id: u.id,
                    name: u.name,
                    country: u.country,
                    region: u.region,
                    latitude: u.latitude,
                    longitude: u.longitude,
                    category: u.category,
                    Update: "", Delete: ""
                }));
        }
    };

    // Column headers
    const getColumns = () => {
        switch (activeTable) {
            case "universities":
                return ["ID", "Name", "Country", "Region", "Latitude", "Longitude", "Category", "Update", "Delete"];
            case "employees":
                return ["ID", "Name", "Department", "Update", "Delete"];
            case "inspections":
                return ["ID", "University ID", "Employee ID", "Inspected At", "Update", "Delete"];
            default:
                return [];
        }
    };

    // Renderer for Update/Delete
// Renderer for Update/Delete with pencil + trash icons
    const updateRenderer = (instance, td, row, col, prop, value, cellProperties) => {
        Handsontable.dom.empty(td);
        const rowData = instance.getSourceDataAtRow(row);

        const btn = document.createElement("button");
        btn.textContent = "✏️";
        btn.className = "cursor-pointer text-blue-600";
        btn.onclick = async () => {
            const { id, Update, Delete, ...cleanData } = rowData;
            await fetch(`/api/${cellProperties.activeTable}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cleanData),
            });
        };

        td.appendChild(btn);
        td.className = "htCenter htMiddle"; // center align
        return td;
    };

// Delete button cell
    const deleteRenderer = (instance, td, row, col, prop, value, cellProperties) => {
        Handsontable.dom.empty(td);
        const rowData = instance.getSourceDataAtRow(row);

        const btn = document.createElement("button");
        btn.textContent = "🗑";
        btn.className = "cursor-pointer text-red-600";
        btn.onclick = async () => {
            await fetch(`/api/${cellProperties.activeTable}/${rowData.id}`, {
                method: "DELETE",
            });
        };

        td.appendChild(btn);
        td.className = "htCenter htMiddle";
        return td;
    };


    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle Add New
    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = { ...formData };
        let endpoint = "/api/universities";

        if (activeTable === "universities") {
            // Auto lat/lon from Gemini
            const geoRes = await fetch("/api/gemini-geocode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            payload = await geoRes.json();
        } else if (activeTable === "employees") {
            endpoint = "/api/employees";
        } else if (activeTable === "inspections") {
            endpoint = "/api/inspections";
        }

        await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setFormData({});
        setDrawerOpen(false);
        fetchData();
    };

    // Drawer fields
    const renderFormFields = () => {
        switch (activeTable) {
            case "employees":
                return (
                    <>
                        <Input
                            name="name"
                            placeholder="Employee Name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            className="mb-3"
                        />
                        <Input
                            name="department"
                            placeholder="Department"
                            value={formData.department || ""}
                            onChange={handleChange}
                            className="mb-3"
                        />
                    </>
                );
            case "inspections":
                return (
                    <>
                        <Input
                            type="number"
                            name="universityId"
                            placeholder="University ID"
                            value={formData.universityId || ""}
                            onChange={handleChange}
                            className="mb-3"
                        />
                        <Input
                            type="number"
                            name="employeeId"
                            placeholder="Employee ID"
                            value={formData.employeeId || ""}
                            onChange={handleChange}
                            className="mb-3"
                        />
                    </>
                );
            default:
                return (
                    <>
                        <Input
                            name="name"
                            placeholder="University Name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            className="mb-3"
                        />
                        <Input
                            name="country"
                            placeholder="Country"
                            value={formData.country || ""}
                            onChange={handleChange}
                            className="mb-3"
                        />
                        <Input
                            name="region"
                            placeholder="Region"
                            value={formData.region || ""}
                            onChange={handleChange}
                            className="mb-3"
                        />
                        <Input
                            name="category"
                            placeholder="Category"
                            value={formData.category || ""}
                            onChange={handleChange}
                            className="mb-3"
                        />
                    </>
                );
        }
    };

    return (
        <div className="p-6 w-screen">
            <h1 className="text-xl font-bold mb-4 text-center">Admin Dashboard</h1>

            {/* Switch dataset */}
            <div className="space-x-2 mb-4 flex justify-center">
                <Button
                    onClick={() => setActiveTable("universities")}
                    className={`px-3 py-1 rounded ${
                        activeTable === "universities"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-200 text-gray-700"
                    }`}
                >
                    Universities
                </Button>
                <Button
                    onClick={() => setActiveTable("employees")}
                    className={`px-3 py-1 rounded ${
                        activeTable === "employees"
                            ? "bg-green-600 text-white"
                            : "bg-green-200 text-gray-700"
                    }`}
                >
                    Employees
                </Button>
                <Button
                    onClick={() => setActiveTable("inspections")}
                    className={`px-3 py-1 rounded ${
                        activeTable === "inspections"
                            ? "bg-purple-600 text-white"
                            : "bg-purple-200 text-gray-700"
                    }`}
                >
                    Inspections
                </Button>
            </div>

            {/* Add new button */}
            <div className="flex justify-end mb-4 z-10 relative">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button className="bg-green-600 text-white">+ Add New</Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-6">
                        <DrawerHeader>
                            <DrawerTitle>Add New {activeTable}</DrawerTitle>
                        </DrawerHeader>
                        <form onSubmit={handleSubmit} className="mt-4">
                            {renderFormFields()}
                            <Button type="submit" className="bg-blue-600 text-white mt-4">
                                Submit
                            </Button>
                        </form>
                    </DrawerContent>
                </Drawer>
            </div>

            {/* Handsontable */}
            <div className="z-0 relative">
                <HotTable
                    data={getData()}
                    colHeaders={getColumns()}
                    rowHeaders={true}
                    stretchH="all"
                    width="95vw"
                    height="70vh"
                    colWidths={150}
                    licenseKey="non-commercial-and-evaluation"
                    cells={(row, col) => {
                        const cellProperties = { readOnly: false };
                        const colName = getColumns()[col];

                        if (colName === "Update") {
                            cellProperties.renderer = updateRenderer;
                            cellProperties.readOnly = true;
                            cellProperties.activeTable = activeTable;
                        }
                        if (colName === "Delete") {
                            cellProperties.renderer = deleteRenderer;
                            cellProperties.readOnly = true;
                            cellProperties.activeTable = activeTable;
                        }

                        return cellProperties;
                    }}
                />

            </div>
        </div>
    );
}
