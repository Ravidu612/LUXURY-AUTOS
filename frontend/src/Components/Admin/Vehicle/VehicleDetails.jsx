import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    IconButton,
} from "@mui/material";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const defaultVehicleDetails = [
    {
        vehicleId: "V123",
        image: "https://media.ed.edmunds-media.com/toyota/corolla-hatchback/2025/oem/2025_toyota_corolla-hatchback_4dr-hatchback_nightshade_fq_oem_1_1600.jpg",
        name: "Toyota Corolla",
        type: "Sedan",
        fuel: "Petrol",
        seats: 5,
        transmission: "Automatic",
        price: 20000,
        status: "Available",
    },
    {
        vehicleId: "V124",
        image: "https://hips.hearstapps.com/hmg-prod/images/2025-tesla-model-s-1-672d42e172407.jpg?crop=0.465xw:0.466xh;0.285xw,0.361xh&resize=2048:*",
        name: "Tesla Model S",
        type: "Sedan",
        fuel: "Electric",
        seats: 5,
        transmission: "Automatic",
        price: 75000,
        status: "Available",
    },
    {
        vehicleId: "V125",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDyFWa9M4I6mXaoi0DySBQx3jZ2Q0zCtWDcA&s",
        name: "BMW i7",
        type: "Luxury Sedan",
        fuel: "Electric",
        seats: 5,
        transmission: "Automatic",
        price: 105000,
        status: "Available"
    },
    {
        vehicleId: "C001",
        image: "https://media.ed.edmunds-media.com/mercedes-benz/c-class/2023/oem/2023_mercedes-benz_c-class_sedan_amg-c-43_fq_oem_1_1600.jpg",
        name: "Mercedes-Benz C-Class",
        type: "Sedan",
        fuel: "Petrol",
        seats: 5,
        transmission: "Automatic",
        price: 55000,
        status: "Available"
    },
    {
        vehicleId: "C002",
        image: "https://parkers-images.bauersecure.com/wp-images/22027/cut-out/1200x800/062-audi-a6-review.jpg?mode=max&quality=90&scale=down",
        name: "Audi A6",
        type: "Sedan",
        fuel: "Petrol",
        seats: 5,
        transmission: "Automatic",
        price: 60000,
        status: "Available"
    },
    {
        vehicleId: "VAN001",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStZMepnObGluNkDt85rtC1AF2TEcoZxRt5wg&s",
        name: "Toyota HiAce",
        type: "Van",
        fuel: "Diesel",
        seats: 12,
        transmission: "Manual",
        price: 45000,
        status: "Available"
    },
    {
        vehicleId: "VAN002",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTEhMVFhUXFhUYFhcYGBgVGhcVFhUaFxcYFxoYHSggGR0lGxUXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0dHR8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tKy0tLS0tLi0tK//AABEIAMIBAwMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAgMEBQYHAQj/xABNEAABAwEEBgcEBgcECQUBAAABAgMRAAQSITEFBkFRcZETIjJhgaGxB0LB8FJicpLR4RQjM0NzosKCstLxFSQlU2N0g7PDNERUk6MX/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAhEQEBAQEBAAEFAAMAAAAAAAAAARECEiEDEzFBURQycf/aAAwDAQACEQMRAD8A0sCmy9IsXy2XmukGaL6bw4pmdtOELFZFabOgu2gFKY/SH9g2uqr2d3Hl5mtdDfKilmsfZsyW/wBmVN/YUpHmk1ZND61lhgoUVPOXlXStalEJw7SlZich3bKz9xr7a9OrQ2krWoJSMSTgBWfa4acbtRQhtJuNqKgsmLxiMtg48qgdPawqWqXllavdbTgB3xkOJ88qgHLO7aMVzckdUYJz2/S9O4Vnrq1rnnD22W8hRQ2LywYKiMAZghIzUfLjXLJowk33SSTvzPHcO4eVPrJZENjqxO/5ypwaw04gACAIHdXFqwoE0VZwoA4kKEHEGqnpnRSmV9K1hHzB3/GrZRHEAgg5Gg7qHrkWjjJQSOlb2g5X0Tt9cjjBrXGbUlxIWhQUlQkEbRXnjS2jVsr6Vr57jvq3aja3XMDNwn9YjMoV9JO/48RW+bjPU2fDWCRvoqkjfSSHApIUkgpIkEbQaCRXokea0ohs91LJTSYqD0nrZZLPN94KI91HWOGyRgPE1Lf6sn8WNCd9L9UCTgBmThHGsk0r7V1GRZmo+srrHiMgPOqdpXT9stOLzyo3TgOAyHKuXXUdpzf22vS+vNis03ngsj3W4X5zd86ommPa26uU2VoIGxSuurjjCfI1mynGxmSo8/PKiqtp91IHmax8tZExpLS9rtJvPPLPFRgcNgHdFRpLaczePPzpobysyTSzdkJpijKtv0UgccaTLqztNO27DTpFkA2VRFhkk0uixVItsiT4UuEVEMG7GKXRZxToJrt2hpFLVHCKUihQEu0KBdTvHMUKGN+TWV2ww+//AMw//wB1WJp7rF7SUXuiYkJmFOZEAxiDknAzvjaKrrmk2ylSkuJWoSQkLBKj35xxg1r6ncv4Z+nxZ807feABMwkZk4Col63rcN1kED6UYngNg7zyGdBhly0QXSkJSolIAiJAEDHHDad5qWYYSgQkR8eNc3QysOiQnFeJz347ydpqTyohNcKqAxNFIopXRSug6aKrI0CuiqOB4UByajFaxWcKKVKUkgkGUnMGNk1JQTgMSRhUxbLYwhAD62+yJSqFHLanEjxoarrduZd6qXEKkZTjHDOoC32Jdnc6VqDgcDtBwIIGefkK45aLO3aFPMFSyVLISEhCAFYAYE7+7ZSFv0s8rMpQDOG2MOdIL9qfriGUfr5S0ZlJ7SVfV3g+AOeBkUppb2qpxFlZn6y8fIYDmayxbyTibyz34D58K5+kLOQA4D41udWTGbxN1YdLaz2y0/tXilP0ZAHIQPKoNTqJxKln530kmzqOc+ONOWrDUUiq1KyACfM0Xo1Kzk8akxZBJ4ml0sigjG7EadN2IU9SmjgUCCLOBS6WxRgKClgZkDjhRHQmjXaTbtCVdkgwRPj/AJUrFAVAxPAfGj0RGfgPjShoGz1vbTmscBieQpo5plPupJ8hUU+z1zxPrV51M1Xs77PSOhSjeIgKujDhj50FTXpNxWQA866xY7Q+QEhxc7gSPLDbWu2TQlnb7DLYO8pCjzVJp8LK4ohSUKIAMECe85cKl+BiLmjCklKhCkkgjcQYIoVP6cTFpeH/ABXP75rtGlXbZW5s/DlU1q/YLrkqT7pzgicMqft2YCnNlEKHj6VDUneHzhXCqiFVEJoFCaLNP7Bou/EhRJyQgdYjjs8AamrJqi8s4sobT/xFqvcgbw5CmJqqk0EpJyBPATWiN6lWUGVlZ7gSPM58hUtZrHZ2RDbSBGMkXiDvBVMbcqZT1GbWHQL7vYbURvAkc+zzIqZs2o7p7ZbR9pRWfut4fz1dHbdO0nzpIuqOznhV8s+kK1qYxEOvOrG1KLrCDxCQVH71SFh0DYmSOjsrMj3lJ6RX3nJNOLqjtAqj646YtDb/AETDigAhN6IGJk5gTkRV8w2tEGirI6ZcsrCjlJaQTHGKMrUvRys7DZd/7FH4Vl+q2tzzLyUvuKU2owbxkpJ94E4xvFbNZHryRFYsWVAPezzRqv8A2THgkp/ukUxd9l+jTlZyn7LjnxUau6TNGu1F1m9o9ktjPYW+j+0lQ80fGou1eyP/AHVq8Ft/FKvhWtEUVQOzPZ38aaaw21+zK2pxR0Tgx7K4Oe5YHrVf0tq9abKCp9laEjNWCkjipJIHjW9au6TLwcbdR0bza1X0Zwla1FJB2jZPdO2pRxgHCMN1XR5Tc0m2N54D8aVYFpd/ZWdZG8ggczA863XSuozAJcszTbaziUhKUhR7jHVPlwqruApJCgQQYIOBB3Groy02G1LeLGPSASUgpECAe1PeNtS1m1DeVi64hPNZ/DzqXsiZ0qrEYoGZgdhO01bxZicoPBaFeQVNPUgz7SWgU2QICVlZWTMgAdWIgf2jTap7XM/seK/6Kr81UcTn4Cjk0kM/Cjk0EE+OseJ9TWkez5UWZX8RXoKze1do8T8a0TUA/wCrq/iH0FVKtRcpEL64I3x/LNGmkSesOP8ATRGeabUTaHiTJ6Ref2jQoumv27v8RfqaFR0PTRmT1h4+hooyprpN0paUpJggYHjh8aiLZoDQLlqWQCEISJUs4gTkANpMHlnV3sWqdkaT10l0714CeCdncSai/ZnZVI0e0taiVvFTqiTJhRhGey4lOHeatEd09+fma1Ofhm9fIyHkoF1tISNyAAPKiKWo7OdIv6QbR23G09xUJ5Co60azWdP7wq+yk+pwrTKUKDtVyonRpqtv64tjsNLV9pQT6TUe7ri6ew22niCo+ooLreGzyxoGdx9PWs8tGs1qV+9u/ZSkfCajLRpB5fadcPFao5TUXGqSZiUg7icfKs10o/ftVoVuXc8EC78KX1LRNqCvoIcUeF27/VUTZ1XgpRzUtSj4mn/VhLSLUi9z+FaV7N9YC6yEL7TZCCZmZ7E7piJ2lOwkTnyiIg13VbSX6Na03puLPRuR9FWSu4gwqe6p1ixpultf02d5xpVnWShRE3wJGYIEHAgg+NIte01s/uFffH+Go/2gaOvoRaoBUghp+P5F9wx5LTVOZQAchTnmWM3qytIT7RmtrK/BSTSqfaHZ9rTvhcP9VUBKExIAI9KL0QBywNXxE9VpLOvdlV7ro4pT8FU7RrbZT7yhxQr4TWUPIjs4GnlnUTiAY8Kl4izrWpI1hsqsnU+IUn1FQ+sOjmLSLzTrfS+71k9ePdOOe4/DKsWdgEYgg0npfQaLSyplZzyP0VDsqHDzxG2p5PamlBTpNaVAghIBBwIIQJBqzCqpoJRNoDNoMWholtCye2mIDaic8xcUdhCThdu2otwJJjuhWe44RNFqv64/ueK/6KgJqc1tVIa4r/pqAosdGfhRiaT2+FGoqGtnaPE1f9Q1/qFfxD6CqBbO0eJq26p6WaZaUHFQSskC6o4R3CqzV26SkludYfOw1Av60sx1QsngB6mm7utAMXWlEjeYnkDRMqE05/6h37avWhSNtdLjil3YvEmJmJoVHRKUy0sCWlgZxhxmnZNOtEWTprQy3h1nETO5KgpQ4wkgd8VEalah+i2RCG8ChDbafABPoDVRtFqWvtrUriokeZq0a4ufq0J3qJ+6I/qqoqNbYIOUg4aWWcaQUcfn5300JnvokUquiKFTQkaIqmWk9IJSmUuInHIgk8BB+FVpWmHL5Xe4DZyqXuLjUNVhdatjv0WCkcVhR/oFQtkVdbRjs9ad6t2tX+h7W8rNSwgHKQA2D5qXUBq9bbyChR6ybuZnAiBE8N9TVxLLVIqG0rnG8AczUwQaZGxdOvBaRBjGdla1JGqap6QTa7NcexJT0D/2gOo5xIOe8pGyqTbLEplxbS+02og942KHcRBpfQFqVZLYlpZTdfSEyDICpPRK4hUjxqz68WG+hu1oGxKHPsnsK8CY8U1OblOpsVBlfgadJE01UiDR2zB7vnCurkXU1NGsAKVAbCYNHSZ+FBKoOVRUghyniHRFMi4Co4iM+ePxpZKDmKyine0TR+KLUgfUd7x7ivVJ4prtm1lefs9xN1TyBJvSS62kSSCCJcQBJBxUmVZpVNst1mS62ptY6qklJ/HiCZ8KyYFdltBQSUqQvAjCFAyFDdsI4ipY3zTu2aSW9F4pwOF0b4n0pKak9JWdLrf6U0ABIDzYwDayYvJAyQonL3SYwBTUSDU10dBx8KMTSU4+FHmgTLAJkpT5mjBMZQP7NdmhNAMd58vwoXe88/wrk0JoBcHfzNdrk0KCRQcBwFTOpyZtrA+uTyQo/CoJpXVHAelTmpbkW1k96vNtQrJi766O9dsbkqPMgf01TtJ6QSygrUCY2DM1oGldGIfUFKKgQI6pEYGdoO+oHS+obNoSEqedAmcLnDanvrVrEZBpLSi3XFLSVhJuwm8YHVAOGWc86cHTLzJugg9VM3gTjicMcMCPEVrP/wDIrHdSA46CLvWBBkiJJBkYxsim1p9jzC1FRtLv3UD4GueVv4ZSNJ2ly8QVKCBeUUpwSkbVFOAFOrJrK4BCgFbjl6Z1q9l9mjTLLrTbph0BK1KxURiI6sADE86S0l7LmHZKAlpR2tkpGH1CCnlFXKbGKWu1hxRXdSmdiRA/zpr0taRa/Y5awf1b7Ch9a+g8oPrVo0ZqYqzNpQhlEwApfUJUdpJJmJnDZTF2ImwWQjV9pPZLzhjd13VweQBqHVqCv/5Sf/rOcfaq/wCuTYbsbLYAAS80IAjJKtmyc/Gq8u0vbjyFLE0xd0PaENgJcaUQQSVXx1RnhBxw7qrOjbTBOO2ra/aHSlSSDilQwGOKSMKz21FbRurBScPnDgasEzrHbzDagcUkR4GfjWzam6SRbLGkKxCkdGsd8QfGIV41hFn0hKTKUqGI6yELjDZeEjjV09k2lejdLCjgsSnH3kifS9yFUSz1iLTq2HD1kGBsvJzSRO8QfGu9ABsPjV/tei7PaClTzYUQCmQSkxuN047aTtWqtmujoWUEjMOuPweBC45ir7xjxKpIcjh3qOAG7uoLeSfeT9786nbVq8TgrRlmVGUtl0ebhoqNBODsaNsgjL/V28PvGntftz+oKYxkc/zp2xbQNo+fGp2y6PtSTJ0fZFDd0TCORBw86s9js4KZVZkNK+jDSuRR8Yp6Twz9zSjQ7TjY4qSPjVK16sLLqkPIWL0XVQoRhik9+0Z7BW9FnuT90D4Vw3hU9LOZHnPQT62VSClSSLq0nFKkkQQobQQYOPmAR3TGjuiIW3JZWTcJxKVbW1n6Q8xCtuHolZUQRJx3Eg+BGIqsaa1WdekC2O3Dmh39ak+BMEcRU1qMKnGjmYnZ+H+daZbvZXKSW3khzYLhCDxxJSe8Yd1UHTWg7RZFXX2ymclZpV9lQwPDOrqo69XL1cmuTVQa9QvUWa5NAe9Qok0KKkk4YVOakn/XWcJxVn/DVTR/Qj6f3Szn7p2ZxvqS1Xsq2nUvuIWhLZCiVIUmQSEwJGfW8q5+pfwuNVKt6B4YUUATuHOmDOnrOrJwD7Up8zhT5t5KuyoEbSCDh4VraziQC0fSI5V1SRBhfpSD6UlKVJMiAPKm5SKWph70ZCRBBy2VxCFAZA57d5pmU8aMFH6RpphZ68cLprql+HgaSDit9J2l6EqXdkgE4E4wJirpiD1tYDxszRJF98Cc4hCz8KrOm7A9YusTfZmCodUJJwF4e7xkjLGTUm1pg2kWFxQg/pS0mMsGVkZ9xA8KuDqG3ElC0gpUClSTiFJIggg5gip+Vu8/FZu1agoSDIORz886z7XBf68+Hqo1Y9O6AFitSmWHFN3h0jMkqStBPZUFZkEEYY4TGNU7TLilOG/AVImMpg5d340itN9l+jW16PWpaErvOu9oBWSEpGY7qt9n1ZsaHkvJYSlaSSkpKkgEgjsg3Tnuqveysf7N/wCq75kCrqRWmafNEbMDsp0hwbcOOXgcvjUQhcU8s7xOFSxIlW1EZGl0vHaKrDOmgMujBjsdKE4jAghxKbuOGGHGpFrS2EqadA3hKXR4dEpRNZaTIcBo1RA03Z/edCP4gU1/3AKeWe0oXi24lQ+qoK9DQOrtcLdFD0ZijqeSBJIA3nD1oCFqiFimtp1gsrfbtLCftOtp9VVGva+6NTnbrP4OBf8AdmgmC3Te2WFDqC24hK0KzSoSDVctPtT0UnO1BX2W3leYRFMH/a/o8dhNpd+wz/jUKLim+0HUM2MF9iVMT1knEtEmBjtSThOYwB31Q5rYbR7UrM8C05YrSGXAUOKWEwlCsCSlJJMTWPPpuqKdxjjuNWUCa5NEmhNUHvUKJNCg9Ao/SDncTxKvhSOkbE6ttQcKLmBUBMlKSFGJwnDdU0TjBSR88aIR3DnXiehSrfqi4MWlhY3Hqq/wnmKomvgfs7SULC2+kJB2XkgYgEYEZTW2gEe6I7jPIECsq9tKLz1iByh6ZEYAtk+Vd+epXOxX9RtZbVZ0llLikt9tAIBH1gkLBwMzhhnvq8sa6PDtBCuIg/ykelUy4ltTLjvWSFo6RJkdU9tKSkz2CRsxitOtGptnI/VqWjCMwsR/ax861bf0zk/Zozrwg9tojLsqB8iB61J2fWmzK98pO5ST6pkedVu26jPDFtxtfcZQfOR51B23QdpaxWysDeBfH3kSKupjU7PbmnOw4hXcFAnlM06isQ6Q76cWfTD7fYdWkDYFKA5AxTYnmtH01ZkNrsQQkJSLVkBAlTTpOXfU+UVlDetD6ltdKq+G3A4AQntJSoDEAH3jUvZPaen97ZyO9C5/lUB61YWG/tm0dfbszgzS4tEzHbSFRzb9aye2JMkKMmQCZmYT51tGlNaNH25hTDy3Gr0EFSCShQxSoFF78wSNtZraNXLz7jSbQwAnolJcWsoQtLjYUkpJSTkRM5d9P2T8NH9lLX+zE7i8v/uBNXtNnnKonVbR7dmszTSFBbbST1xk46qVOOTMXZUQMcJO4UytPtG0e2u4bUifqpcWn7yElPnWvwzZasTlkIpJGBp1ovSzVoQFNrStJyUlQUDvEjb3UrarNtFNTEfa2sbxTfaXg4kkC6o4XwTgmc5+lM9rCo6Y0cuzLKm21ONyAot3g4En3wEjEpnFIxIxHfbdIaWRZG1POGAnAAZqJySkHMn8TkKx606WLjzjoQlormUtC4kJ3QMz35kzUai+2PSj7MEvudGdquuBum+CYPlOMU7tWkmnClNqs7LiVRCwkBQnbIJqhaOtKhdAtL4CQqApaljrY79kYVZbLaVKGNqGfvNBXrNKZ/DbXVD1hcaWy++lo3gLrriQThCVJBiRdVsqB07pixWoI/T7TaStKZS3BUgThII2naTJ9KsmsLq7QyWVvBwSFA3EphQyMgTu291Uiw2mztBwWuzB67swvIKT1rpOzb4VK1DBLmj09lsK4rdH/iNcOlLEnJlvkpfqlNGe05YrxLVmSkbAptKyPEOpnlXUafT7rM/ZZj/yKqqm9H2uz/oj1pLCSpN1LSAkIvuLPVvQs4ABR2EwcsKLpwvtuutNtElpy6Uykfq1gqZXJRPWSDInAjvwb6H1hHSKK2Te6q0NqUG0uOom6FQkQCFGdpiJEzT/AExbLVaGVPvdCLW44gGJTDCEqxWEqIBvKSAM4TjOBrP7EN+j2pXbW21OUqKiTsABJHIUz0qxdWO8A8CMCKUasisS4/hjIaASJ+spIy40fTbahER1TGInu+FVEXFciuhK9yeUfGuG99AcyKumBQot9X0B94/hXaamPQNp0w4gwW7vHHlhTFzTjhyIHAD4yKs7gSRBg90SPEVFW3QbS+zeSe4Ycj8K8s65/cd7Kr7umnf94rkj/DVG9obzjwZWVKcuFzYOqFoH0QIHVGdXfSGrjqcheHdnyz9arGkNFnEXd4NdOc/TF0nrrYwhgrGV4EcFXI+PKkdB+1NTKENWhm+EJCekQqFEJEAqSoQox3iobWTThLCbOrBSYSrvSjBGe4Hxqnurk11uMxv+idfrA/gl8NqPuujozjsk9U86s7TsgKBkHIgyDwIwryy2kzMHlUhozStqs5lh1xruSogHinI8qzg9IWqwsvftWm196kgnnmKhLZqPZF9i+2fqqvDkufUVnWivana24D7bbw3/ALJfNPV/lq5aK9pthdgLUthW5xMp++icOIFMDDSupRs9xwPBaOlaBlJSQFrCd5B7XdVa03q8+0qf0V1tMCc3EhWMwtJIjLM1pOs9tbdsDzjLiHAkIWFIUFDqOJXsP1as87qnnbq+rJjzlwp1bRBR/wAvZvKzNj4Vu9u0RZ3v2rLazvUhJP3okVRrRq5ZnNIvMKSUoFmZU3dUQUXShskTM4HbNaZlZVpPSC0y2hakpIhYCiAoZQoA4znjUPT/AEyEl9aWwqAtSBJCiqFEA4ADKMIp9ZbEhsAqxVzjh+NVXNVdPWiwuh1mSkxfQZCHE7j37lZjyrXbF7VgtsE2WT/F9epWSuWoTkCeJmj6OtKb0DCfETVS/Kzaz6wO2xwKWAlCZuNgyEzmSfeUd9RCTXVGaCYGJoh5ZFHZUxZSrcah9GpfdUQ1CYBJOAgDvNJjSzt4oKnlEYG6pEcwVCpq4tIJqG0zZDPSt9odoDMgZKHePThRWypWKlODuKwrzCRRklWaZ8TFAnbNZFLAu2ZomBK0FKST9lWHKaj1aZf2NqH9pgf+Mmm1q0omSDZ03tskTPfAxqNtOliMm2hxSTRUpaLa8vApbj67hPk3FETZXFQOkQB9RBVyK5imFl0o4QTgO5CQPzoLZtDoycx2qJSOX5VMombNZkJWmSpbk9UKVfM9yR8BRrTKhAEkkGpTU2yt2Zl28iX1JUErJwSVCITujOdtOdD6OC3UoAvSFT4JJw5Vjv45tPyrSGJxjfljjSiLNewAxnbAx4mr+7quEmbs9wSQI5ZyTTW26u4SoFO7EDZu+dteL/Isq+Oooi7IZOHx8xnQq5jV4/W5Gu1r/JTz01YJ8PD8DXCgDP0pFszgElJ2AwQeRMfOFHTniMfnKK07jlI402tVlbcEKQFd+3nmKchvu9KAaO2gq2k9T2nMUwdwWmfOPhVaturAbm80AN4SI5jCtRDHeK4bOd81qfUsS8xjNo0EnYIqMtOgo+YrZbdoFpc9W6d428RlUDatV1Jm5dUO6AfEfnXSfUlYvNZHaNE93xpg7o3urULZotSTCkEeH41FWjRYOytzpln9nYLagQSBkqJxBzBjMd1eh9AaYZtDaC06hZuJvJSoFSTdEhScx4isjtOhzsqJe0eUkESCMiMCDvBGIrWpY9DiqTpRwN6ZBJgLsJT/APoefYqiaO1yt9mwDxcSPdeHSfzSF/zUx111kNvUhS2Q2pKLhhV4KhRUCJAIzOGPGqmIRDcWh5ShBStYjcSoz8RUxobR4eKluSW0ReAmVqOITIxAgEmMchtqHsp7R33T/KAfOatei+rYpSSklxYUobAVMpJ7+qaKeO2xtsFAe6OA4kJaSbiVDsGUFIMZkdbMZY1E6TsyFAErvglKW3s3CsJvKnCQAQeosnDIg41HrGYnCcNx2T5DlThlS3FwCr9ZKFXerKg3eEbL2X3qoDiCDBjZliMRMju2+NBCL3vAbpy50Z1JCQSCCSRBxIICSQfvgeFJTWdMT+iFdGlaesQsQbj90bsRhOBIx30ey6GXj0aQJ2qWCfUzVeCxtFLNut7bw8Pzq6YtrOq76hjdA+0DSjmrhHbebT3kj/FVVQ41vV9386U/SWRtX90D+qpolLZq7ZVYuWhF4bUnMd4STNIN6O0egjJR33Mz/wBTCeGNRbmlWE5+agPgaZPaXaWtAF1IC0kqlRIAOPHDcKumLUt9hPZQrx6k8hBoWezvOn9RZ1HbISTA4xFSGkLQ5pEMps7RWGEBkrFxLRKcFKCirEYDBIO0yZqX/wBA25wQ7aygXQmESYCRABCSkEetZvcn5qzlTX2HQ4ptSTfTIUkCYIMHKRtqwaqtlh3plJm6k3RIzUIJ74Tewqz6v6BbskkLU4tQgqVAwwMAJEASNs51JrYQrNCDxE8torzfV7vXxy6c845ZtPsnu3zs/GnDelmySLw8cB3+A399Rzmi2z7kZHCR6mmy9CokkLWCe9Jny7sq83jt09VYEWi8JTcUDtCxjzxoVWF6voJkrXP2lfA0Kvnr+L6Wl4DJcXTkd/lQLcCIkQBAz9Yo7ZOSpMe91RPgMqCWYPVy3G8eU5V3YExjq4/VJgj576O0onYBxMn0rhAJgEBW2ImO/M0ZSsgQZ3j8qDuJ2+UetcCN5POPSupBGfW8vIZ0p0gOIjlNAmWwPzx9a5dHDLZRygHfyjlhRQ3UDTSBVGCEub0qI9DhVff0feJmzqH2FJw8FfAirYBHdXSPnfWpcLNUG1aAdPZbMfWInkCfWoO16KMwoR4fj+FawtHcaQfZSoQoAitz6lZ8sWtWg5mJqHtOiCNlbPbdXEKxQSnj1hzzqAt2rzqZ6t4bxB9MfKtzuVm8soVZCicMKmtWbWkhbDhhK4gkwAuLuJ2BQMTsISdlTlt0aNqT4iqfpKzKZVeg3d+cce7vrpKxUhbtGOMmFJJSFRejOTIBB7CogXTuBxBBKdms0rNwXyZSnAmQeqb10iDdJwnM8+2HWd1KQErQoAQAsXoG5KgQsDuvRSdv1leUkpvoQCCD0YKSQdl5RUuOBE1rE010w6AtLaIutpKZTkVkyu7vAAQn+xUW5bFjIzRC5ewGVKhgmpikxpNzdSn+k1bhRhZDuo36Cd1PgIrt7h2gcB+NNlAqPWJPHGpJOjz30qiwmpsEYhgbqdM2ZH0BT9FhO6nTVhO6pqnug9Mu2eQ0YBiRAMxlmJ89tXvQmtHSqShxMKOAUmSCe8HEedVbQura3iJBSn6RSSPDZPjV50XoBtjFKSVfSVBOO7YPCuXd5dOdSiHPnOlAvjSRAGZx8+Qo6UkxCT4mPzri2XSePzwoyVAbRSRbVv5YeeddCPqid/aPOgP042fH8KFCDQoJVlYWIhQ2HAp9MudIhroxgSRmStSjHiTgKMtsLhUqHAkeBoyHFR1gAN8z5mqyIgpXigpn6QgnxNGSojqkT9aBFFWoe6Y4CaCjOBHOB+dFd6OOxArnSAkjEKyJgjLiMRXeyDA8ACT4ZVxh28J6w7iAD5elAdWXWJgbRex+7SiSnPE8KIlA258J85orrRG8Tj3GgVvjYOeNF6VU7I+d1InvEelKpJwkCOdQGmdtBSZ2VwikumxzTHHHkKKUuigUA0UuTgEk8cPzrpQo7QPM+cUDd+xoXgoJPEA4d01D23VezLm8m7yM+Bmp5Te8k+XkMKOlv5gD0qy2JjN7d7M7OrFDYOP1mj5Kg+VQz3szT/uVjdDhX5A1sRQKIGsc/A/5Vr7nSeYx0akJb/duDiCPhQGrQ+ieVa+pMbFcpHgPwo0H/L4ir9yp4jIRq4djavuml29UnTk0rxF31rVwyTtn1HGuONCMfn5ip9yr4jNGtSHTncTxP+GafNaip95yT3J/E1eLuOU+XrRFSPHcJ+eVT30vmKi1qW0k9cqVwhPMY+tS9k0Qw32Wkk8Lx5mpkMTnjj88KHQ1NtPgzUydnV4mfL86ImyqPaJVw6vkM6ehFcIE5VFN0ICRgAnwiuBsTgnHfTgYULvdHDCgTUjb3VwCaVg7TPcR8R+FdBjYeNAQ4ZzyFco/Sj6Q50KoQcWQ4oAmCoSJzzqUYZT9EZ7huFChWmXR8+VM9JmEkjOB/eFChWFOZ6qfsj0pvpRZF2CRnkY2UKFZ+p/rQ6axQkncPhQCjlJ2elChW4Opz8KSsxxV9ocqFCgQQol0gmRjgcRsqUKABgAPk1yhUWE1nIV1JxHH4GhQoCjtfO6gO187qFCgMrb4elJz8+NChQOGRh4UZYoUKIj7SoiYOw0SzLJAJJOWdChRTica6M/GhQohBGZ8aKrOPnbQoVQnvrrldoUBFbaIs/PKhQoDE50YnChQorjPZFcoUKg//9k=",
        name: "Mercedes-Benz Sprinter",
        type: "Van",
        fuel: "Diesel",
        seats: 14,
        transmission: "Automatic",
        price: 60000,
        status: "Available"
    },

];

const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
});

const VehiclePDF = ({ vehicle }) => (
    <Document>
        <Page style={styles.page}>
            <View style={{ ...styles.section, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                    Vehicle Details
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Vehicle Name:</Text>
                <Text style={{ fontSize: 14 }}>{vehicle.name}</Text>
            </View>
            <View style={styles.section}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Type:</Text>
                <Text style={{ fontSize: 14 }}>{vehicle.type}</Text>
            </View>
            <View style={styles.section}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Fuel:</Text>
                <Text style={{ fontSize: 14 }}>{vehicle.fuel}</Text>
            </View>
            <View style={styles.section}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Seats:</Text>
                <Text style={{ fontSize: 14 }}>{vehicle.seats}</Text>
            </View>
            <View style={styles.section}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Transmission:</Text>
                <Text style={{ fontSize: 14 }}>{vehicle.transmission}</Text>
            </View>
            <View style={styles.section}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Price:</Text>
                <Text style={{ fontSize: 14 }}>${vehicle.price}</Text>
            </View>
            <View style={styles.section}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Status:</Text>
                <Text style={{ fontSize: 14 }}>{vehicle.status}</Text>
            </View>
        </Page>
    </Document>
);

const VehicleDetails = () => {
    const [vehicles, setVehicles] = useState(defaultVehicleDetails);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ type: "", fuel: "", transmission: "" });


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredVehicles = vehicles.filter((vehicle) =>
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filters.type ? vehicle.type === filters.type : true) &&
        (filters.fuel ? vehicle.fuel === filters.fuel : true) &&
        (filters.transmission ? vehicle.transmission === filters.transmission : true)
    );

    const [newVehicle, setNewVehicle] = useState({
        vehicleId: "",
        image: "",
        name: "",
        type: "",
        fuel: "",
        seats: 1,
        transmission: "",
        price: 0,
        status: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOpenUpdateDialog = (vehicle) => {
        setSelectedVehicle(vehicle);
        setUpdateDialogOpen(true);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedVehicle((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = () => {
        setVehicles((prevVehicles) =>
            prevVehicles.map((vehicle) =>
                vehicle.vehicleId === selectedVehicle.vehicleId ? selectedVehicle : vehicle
            )
        );
        setUpdateDialogOpen(false);
    };

    const handleAddVehicle = () => {
        if (vehicles.some((v) => v.vehicleId === newVehicle.vehicleId)) {
            alert("Vehicle ID already exists!");
            return;
        }

        setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);

        setNewVehicle({
            vehicleId: "",
            image: "",
            name: "",
            type: "",
            fuel: "",
            seats: 1,
            transmission: "",
            price: 0,
            status: "",
        });
    };

    const handleDeleteVehicle = (vehicleId) => {
        setVehicles(vehicles.filter((vehicle) => vehicle.vehicleId !== vehicleId));
    };

    const handleSubmit = () => {
        handleAddVehicle();
        setDialogOpen(false);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Available Vehicles
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
                <Button variant="contained" onClick={() => setDialogOpen(true)}>
                    Add Vehicle
                </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                    fullWidth
                    label="Search Vehicles"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <Select
                    fullWidth
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Sedan">Sedan</MenuItem>
                    <MenuItem value="SUV">SUV</MenuItem>
                    <MenuItem value="Truck">Truck</MenuItem>
                </Select>
                <Select
                    fullWidth
                    name="fuel"
                    value={filters.fuel}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Fuel Types</MenuItem>
                    <MenuItem value="Petrol">Petrol</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                </Select>
                <Select
                    fullWidth
                    name="transmission"
                    value={filters.transmission}
                    onChange={handleFilterChange}
                    displayEmpty
                >
                    <MenuItem value="">All Transmissions</MenuItem>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                </Select>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {filteredVehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.vehicleId}>
                        <Card>
                            <img
                                src={vehicle.image}
                                alt={vehicle.name}
                                style={{ width: "100%", height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6">{vehicle.name}</Typography>
                                <Typography color="textSecondary">{vehicle.type}</Typography>
                                <Typography variant="body2">Fuel: {vehicle.fuel}</Typography>
                                <Typography variant="body2">Seats: {vehicle.seats}</Typography>
                                <Typography variant="body2">Transmission: {vehicle.transmission}</Typography>
                                <Typography variant="body2">Price: ${vehicle.price}</Typography>
                                <Typography variant="body2">Status: {vehicle.status}</Typography>

                                <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                    <IconButton onClick={() => handleOpenUpdateDialog(vehicle)}>
                                        <FaEdit />
                                    </IconButton>
                                    <PDFDownloadLink
                                        document={<VehiclePDF vehicle={vehicle} />}
                                        fileName={`${vehicle.name}_details.pdf`}
                                    >
                                        <IconButton>
                                            <FaDownload />
                                        </IconButton>
                                    </PDFDownloadLink>
                                    <IconButton
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this vehicle?")) {
                                                handleDeleteVehicle(vehicle.vehicleId);
                                            }
                                        }}
                                    >
                                        <FaTrash />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Update Vehicle Details</DialogTitle>
                <DialogContent>
                    {selectedVehicle && (
                        ["name", "image", "type", "fuel", "seats", "transmission", "price", "status"].map((field) => (
                            <TextField
                                key={field}
                                fullWidth
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                name={field}
                                value={selectedVehicle[field] || ""}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    const updatedValue = name === "seats" || name === "price" ? parseInt(value) || 0 : value;
                                    setSelectedVehicle((prev) => ({ ...prev, [name]: updatedValue }));
                                }}
                                margin="dense"
                                type={field === "seats" || field === "price" ? "number" : "text"}
                            />
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateSubmit} variant="contained">Update</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Vehicle ID" name="vehicleId" value={newVehicle.vehicleId} onChange={handleChange} />
                    <TextField fullWidth label="Image URL" name="image" value={newVehicle.image} onChange={handleChange} />
                    <TextField fullWidth label="Name" name="name" value={newVehicle.name} onChange={handleChange} />
                    <TextField
                        fullWidth
                        label="Seats"
                        name="seats"
                        value={newVehicle.seats}
                        onChange={(e) => handleChange({ target: { name: "seats", value: parseInt(e.target.value) || 0 } })}
                        type="number"
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        value={newVehicle.price}
                        onChange={(e) => handleChange({ target: { name: "price", value: parseInt(e.target.value) || 0 } })}
                        type="number"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Add Vehicle
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VehicleDetails;
