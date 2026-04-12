package com.verdex.verdex_backend;

import com.verdex.verdex_backend.model.JusticeLocation;
import com.verdex.verdex_backend.repository.JusticeLocationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class JusticeLocationDataLoader implements CommandLineRunner {

    private final JusticeLocationRepository repository;

    public JusticeLocationDataLoader(JusticeLocationRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        List<JusticeLocation> data = Arrays.asList(

                // ─── DELHI ───────────────────────────────────────────────
                new JusticeLocation(null, "District Labour Office – Delhi", "Labour Issue", "Delhi",
                        "Handles salary disputes, unpaid wages and wrongful termination.", 28.6139, 77.2090, "20 mins", "89%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "Women Legal Aid Centre – Delhi", "Women Safety", "Delhi",
                        "Support for domestic violence, harassment and maintenance cases.", 28.6200, 77.2150, "15 mins", "91%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "District Consumer Disputes Redressal Forum – Delhi", "Consumer Fraud", "Delhi",
                        "Consumer fraud, defective goods and fake billing complaints.", 28.6050, 77.1980, "30 mins", "84%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "Delhi State Legal Services Authority", "Free Legal Help", "Delhi",
                        "Free legal aid for below-poverty-line citizens and marginalized groups.", 28.6170, 77.2230, "10 mins", "93%", Arrays.asList("Hindi", "English")),

                // ─── MUMBAI ──────────────────────────────────────────────
                new JusticeLocation(null, "Mumbai Labour Court", "Labour Issue", "Mumbai",
                        "Salary disputes, ESI/PF claims and contract violations.", 19.0760, 72.8777, "25 mins", "85%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Mumbai Women Support NGO – Sneha", "Women Safety", "Mumbai",
                        "Safe shelter, legal counselling and court accompaniment for women.", 19.0820, 72.8850, "10 mins", "92%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Mumbai Consumer Forum – Bandra", "Consumer Fraud", "Mumbai",
                        "E-commerce fraud, insurance denial and builder disputes.", 19.0550, 72.8400, "40 mins", "82%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Maharashtra State Legal Services Authority", "Free Legal Help", "Mumbai",
                        "Free legal aid, lok adalat and pre-litigation mediation.", 19.0000, 72.8200, "20 mins", "90%", Arrays.asList("Marathi", "Hindi", "English")),

                // ─── BANGALORE ───────────────────────────────────────────
                new JusticeLocation(null, "Bangalore Labour Office – Shivajinagar", "Labour Issue", "Bangalore",
                        "IT/BPO salary disputes, layoff notices and provident fund claims.", 12.9850, 77.5950, "30 mins", "81%", Arrays.asList("Kannada", "English")),
                new JusticeLocation(null, "Parihar – Women Legal Centre Bangalore", "Women Safety", "Bangalore",
                        "Counselling, legal aid and shelter for women in distress.", 12.9716, 77.5800, "15 mins", "94%", Arrays.asList("Kannada", "Hindi", "English")),
                new JusticeLocation(null, "Bangalore Consumer Disputes Forum", "Consumer Fraud", "Bangalore",
                        "Redressal for e-commerce, telecom and real estate complaints.", 12.9716, 77.5946, "45 mins", "80%", Arrays.asList("Kannada", "English")),
                new JusticeLocation(null, "Karnataka State Legal Services Authority", "Free Legal Help", "Bangalore",
                        "Free legal services and lok adalat for unrepresented citizens.", 12.9600, 77.5700, "20 mins", "88%", Arrays.asList("Kannada", "English")),

                // ─── CHENNAI ─────────────────────────────────────────────
                new JusticeLocation(null, "Chennai Labour Court – Perambur", "Labour Issue", "Chennai",
                        "Handles industrial disputes, wage theft and retrenchment cases.", 13.1200, 80.2500, "35 mins", "83%", Arrays.asList("Tamil", "English")),
                new JusticeLocation(null, "TNSRLM Women Support Centre", "Women Safety", "Chennai",
                        "Legal aid, counselling and livelihood support for women.", 13.0827, 80.2707, "20 mins", "90%", Arrays.asList("Tamil", "English")),
                new JusticeLocation(null, "Tamil Nadu Consumer Helpline Forum", "Consumer Fraud", "Chennai",
                        "Consumer product complaints, insurance fraud and service deficiencies.", 13.0700, 80.2600, "30 mins", "86%", Arrays.asList("Tamil", "English")),
                new JusticeLocation(null, "Tamil Nadu State Legal Services Authority", "Free Legal Help", "Chennai",
                        "Free legal representation and mediation for eligible citizens.", 13.0900, 80.2800, "15 mins", "91%", Arrays.asList("Tamil", "English")),

                // ─── HYDERABAD ───────────────────────────────────────────
                new JusticeLocation(null, "Hyderabad Labour Office – Masab Tank", "Labour Issue", "Hyderabad",
                        "Minimum wage enforcement, overtime disputes and ESI claims.", 17.3950, 78.4867, "20 mins", "87%", Arrays.asList("Telugu", "Urdu", "English")),
                new JusticeLocation(null, "Sakhi – Women Resource Centre Hyderabad", "Women Safety", "Hyderabad",
                        "One-stop crisis centre for domestic violence and abuse survivors.", 17.4010, 78.4750, "10 mins", "95%", Arrays.asList("Telugu", "Urdu", "Hindi", "English")),
                new JusticeLocation(null, "Hyderabad Consumer Forum – Ameerpet", "Consumer Fraud", "Hyderabad",
                        "Telecom, banking and real estate consumer dispute redressal.", 17.4300, 78.4500, "25 mins", "83%", Arrays.asList("Telugu", "English")),
                new JusticeLocation(null, "Telangana State Legal Services Authority", "Free Legal Help", "Hyderabad",
                        "Free legal aid for SC/ST, women and below-poverty-line citizens.", 17.3800, 78.4900, "20 mins", "89%", Arrays.asList("Telugu", "Urdu", "English")),

                // ─── KOLKATA ─────────────────────────────────────────────
                new JusticeLocation(null, "Kolkata Labour Court – Esplanade", "Labour Issue", "Kolkata",
                        "Industrial disputes, contract violations and provident fund claims.", 22.5726, 88.3639, "30 mins", "82%", Arrays.asList("Bengali", "Hindi", "English")),
                new JusticeLocation(null, "Swayam – Women Legal Rights Kolkata", "Women Safety", "Kolkata",
                        "Legal assistance and counselling for women facing violence.", 22.5800, 88.3700, "15 mins", "90%", Arrays.asList("Bengali", "Hindi", "English")),
                new JusticeLocation(null, "West Bengal Consumer Commission", "Consumer Fraud", "Kolkata",
                        "Consumer product and service complaint redressal forum.", 22.5600, 88.3500, "40 mins", "81%", Arrays.asList("Bengali", "English")),
                new JusticeLocation(null, "West Bengal State Legal Services Authority", "Free Legal Help", "Kolkata",
                        "Free legal aid, pre-trial detainee support and lok adalat.", 22.5500, 88.3400, "20 mins", "88%", Arrays.asList("Bengali", "Hindi", "English")),

                // ─── PUNE ────────────────────────────────────────────────
                new JusticeLocation(null, "Pune District Labour Office", "Labour Issue", "Pune",
                        "Wage, overtime and contract labour dispute resolution.", 18.5204, 73.8567, "25 mins", "85%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Stree Mukti Sanghatna – Pune", "Women Safety", "Pune",
                        "Women's rights organization providing legal aid and shelter.", 18.5300, 73.8600, "20 mins", "92%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Pune Consumer Court – Camp", "Consumer Fraud", "Pune",
                        "E-commerce, real estate and banking consumer complaints.", 18.5100, 73.8700, "35 mins", "83%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Pune District Legal Services Authority", "Free Legal Help", "Pune",
                        "Free legal aid and mediation services.", 18.5150, 73.8550, "15 mins", "91%", Arrays.asList("Marathi", "Hindi", "English")),

                // ─── AHMEDABAD ───────────────────────────────────────────
                new JusticeLocation(null, "Ahmedabad Labour Tribunal", "Labour Issue", "Ahmedabad",
                        "Industrial labour disputes including textile and garment workers.", 23.0225, 72.5714, "30 mins", "80%", Arrays.asList("Gujarati", "Hindi", "English")),
                new JusticeLocation(null, "Ahmedabad Women's Action Group", "Women Safety", "Ahmedabad",
                        "Legal aid, crisis support and women's rights counselling.", 23.0300, 72.5800, "15 mins", "90%", Arrays.asList("Gujarati", "Hindi", "English")),
                new JusticeLocation(null, "Gujarat Consumer Disputes Redressal Commission", "Consumer Fraud", "Ahmedabad",
                        "Product defect, insurance and telecom consumer complaints.", 23.0100, 72.5700, "40 mins", "82%", Arrays.asList("Gujarati", "Hindi", "English")),
                new JusticeLocation(null, "Gujarat State Legal Services Authority", "Free Legal Help", "Ahmedabad",
                        "Free legal services for marginalized and low-income citizens.", 23.0200, 72.5600, "20 mins", "87%", Arrays.asList("Gujarati", "Hindi", "English")),

                // ─── JAIPUR ──────────────────────────────────────────────
                new JusticeLocation(null, "Jaipur District Labour Office", "Labour Issue", "Jaipur",
                        "Wage theft, ESI/PF claims and contract labour disputes.", 26.9124, 75.7873, "20 mins", "86%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "Mahila Shakti Kendra – Jaipur", "Women Safety", "Jaipur",
                        "Legal aid and shelter support for women.", 26.9200, 75.7900, "15 mins", "90%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "Rajasthan Consumer Forum – Jaipur", "Consumer Fraud", "Jaipur",
                        "Builder, banking and retail consumer complaint redressal.", 26.9000, 75.7800, "30 mins", "84%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "Jaipur Legal Help Centre", "Free Legal Help", "Jaipur",
                        "Free legal aid, lok adalat and arbitration.", 26.9050, 75.7850, "15 mins", "95%", Arrays.asList("Hindi")),

                // ─── LUCKNOW ─────────────────────────────────────────────
                new JusticeLocation(null, "Lucknow Labour Court", "Labour Issue", "Lucknow",
                        "Government and private sector wage and contract disputes.", 26.8467, 80.9462, "30 mins", "81%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "UP Mahila Aayog Help Centre – Lucknow", "Women Safety", "Lucknow",
                        "Women's commission helpdesk for domestic and workplace abuse.", 26.8550, 80.9500, "10 mins", "93%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "UP Consumer Dispute Forum – Lucknow", "Consumer Fraud", "Lucknow",
                        "Consumer product and service grievance redressal.", 26.8400, 80.9400, "35 mins", "82%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "UP State Legal Services Authority", "Free Legal Help", "Lucknow",
                        "Free legal aid for economically weaker sections.", 26.8480, 80.9450, "15 mins", "89%", Arrays.asList("Hindi", "English")),

                // ─── CHANDIGARH ──────────────────────────────────────────
                new JusticeLocation(null, "Chandigarh Labour Office – Sector 17", "Labour Issue", "Chandigarh",
                        "Minimum wage, ESI and layoff dispute redressal.", 30.7414, 76.7893, "15 mins", "88%", Arrays.asList("Hindi", "Punjabi", "English")),
                new JusticeLocation(null, "Women Cell – Chandigarh Police HQ", "Women Safety", "Chandigarh",
                        "Immediate police and legal support for women in distress.", 30.7450, 76.7950, "10 mins", "94%", Arrays.asList("Hindi", "Punjabi", "English")),
                new JusticeLocation(null, "Chandigarh Consumer Forum – Sector 22", "Consumer Fraud", "Chandigarh",
                        "Consumer complaints for products, services and e-commerce.", 30.7350, 76.7850, "20 mins", "86%", Arrays.asList("Hindi", "Punjabi", "English")),
                new JusticeLocation(null, "Chandigarh Legal Services Authority", "Free Legal Help", "Chandigarh",
                        "Free legal services, mediation and lok adalat.", 30.7400, 76.7900, "10 mins", "92%", Arrays.asList("Hindi", "Punjabi", "English")),

                // ─── BHOPAL ──────────────────────────────────────────────
                new JusticeLocation(null, "Bhopal District Labour Office", "Labour Issue", "Bhopal",
                        "Factory and informal sector wage and work dispute resolution.", 23.2599, 77.4126, "25 mins", "83%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "MP Mahila Helpline Centre – Bhopal", "Women Safety", "Bhopal",
                        "Women's helpline and legal aid for gender-based violence.", 23.2650, 77.4200, "15 mins", "91%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "MP Consumer Disputes Forum – Bhopal", "Consumer Fraud", "Bhopal",
                        "Consumer grievances for local and online purchases.", 23.2500, 77.4100, "35 mins", "81%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "MP State Legal Services Authority", "Free Legal Help", "Bhopal",
                        "Free legal aid and lok adalat services.", 23.2550, 77.4150, "20 mins", "87%", Arrays.asList("Hindi", "English")),

                // ─── PATNA ───────────────────────────────────────────────
                new JusticeLocation(null, "Patna Labour Court", "Labour Issue", "Patna",
                        "Wage disputes, PF claims and migrant worker grievances.", 25.5941, 85.1376, "30 mins", "79%", Arrays.asList("Hindi", "Bhojpuri", "English")),
                new JusticeLocation(null, "Bihar Mahila Samakhya – Patna", "Women Safety", "Patna",
                        "Legal aid and shelter for women facing violence.", 25.6000, 85.1450, "20 mins", "88%", Arrays.asList("Hindi", "Bhojpuri", "English")),
                new JusticeLocation(null, "Bihar Consumer Commission – Patna", "Consumer Fraud", "Patna",
                        "Consumer product and service complaints redressal.", 25.5850, 85.1300, "40 mins", "79%", Arrays.asList("Hindi", "English")),
                new JusticeLocation(null, "Bihar State Legal Services Authority", "Free Legal Help", "Patna",
                        "Free legal representation and lok adalat camps.", 25.5900, 85.1350, "25 mins", "85%", Arrays.asList("Hindi", "English")),

                // ─── KOCHI ───────────────────────────────────────────────
                new JusticeLocation(null, "Kochi Labour Office – Ernakulam", "Labour Issue", "Kochi",
                        "Port, trade and hospitality sector labour disputes.", 9.9312, 76.2673, "25 mins", "84%", Arrays.asList("Malayalam", "English")),
                new JusticeLocation(null, "Sakhi One-Stop Centre – Kochi", "Women Safety", "Kochi",
                        "Crisis support, counselling and legal aid for women.", 9.9400, 76.2750, "10 mins", "93%", Arrays.asList("Malayalam", "English")),
                new JusticeLocation(null, "Kerala Consumer Disputes Forum – Kochi", "Consumer Fraud", "Kochi",
                        "Consumer product, insurance and banking dispute resolution.", 9.9200, 76.2600, "30 mins", "87%", Arrays.asList("Malayalam", "English")),
                new JusticeLocation(null, "Kerala State Legal Services Authority – Kochi", "Free Legal Help", "Kochi",
                        "Free legal aid, lok adalat and mediation.", 9.9250, 76.2650, "15 mins", "92%", Arrays.asList("Malayalam", "English")),

                // ─── NAGPUR ──────────────────────────────────────────────
                new JusticeLocation(null, "Nagpur Labour Court – Civil Lines", "Labour Issue", "Nagpur",
                        "Mining, factory and services sector wage dispute resolution.", 21.1458, 79.0882, "30 mins", "82%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Nagpur Women's Help Centre", "Women Safety", "Nagpur",
                        "Domestic violence legal aid and crisis shelter.", 21.1500, 79.0950, "20 mins", "89%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Nagpur Consumer Forum – Dharampeth", "Consumer Fraud", "Nagpur",
                        "Local business, telecom and e-commerce consumer complaints.", 21.1400, 79.0800, "35 mins", "83%", Arrays.asList("Marathi", "Hindi", "English")),
                new JusticeLocation(null, "Nagpur District Legal Services Authority", "Free Legal Help", "Nagpur",
                        "Free legal aid and lok adalat for eligible citizens.", 21.1450, 79.0850, "15 mins", "90%", Arrays.asList("Marathi", "Hindi", "English"))
        );

        repository.saveAll(data);
        System.out.println("✅ Loaded " + data.size() + " justice locations into PostgreSQL.");
    }
}