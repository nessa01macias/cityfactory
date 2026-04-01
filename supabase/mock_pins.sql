-- Mock data for Community Voice Map
-- Run this in Supabase SQL Editor to seed the map with sample pins across Espoo neighborhoods.
-- These are fictional entries to demonstrate the feature.

INSERT INTO public.map_pins (lat, lng, message, category, created_at) VALUES

-- Tapiola area
(60.1753, 24.8047, 'Love the new cycling paths around Tapiola! Makes my daily commute so much better.', 'love', now() - interval '12 days'),
(60.1769, 24.8102, 'The Ainoa shopping center area gets really crowded on weekends. Could use more seating outside.', 'thought', now() - interval '10 days'),
(60.1780, 24.8005, 'Tapiola Garden is one of the most beautiful parks in all of Finland. Proud to live near it.', 'love', now() - interval '8 days'),
(60.1741, 24.8120, 'What if we had a weekly farmers market in Tapiola? Would be amazing for the community.', 'idea', now() - interval '6 days'),

-- Otaniemi / Aalto area
(60.1867, 24.8271, 'As an Aalto student, I wish there were more affordable lunch options near campus.', 'thought', now() - interval '11 days'),
(60.1843, 24.8195, 'The metro connection changed everything. Getting to Helsinki takes 15 minutes now!', 'love', now() - interval '9 days'),
(60.1890, 24.8320, 'Street lighting near the Otaniemi shore path is terrible after dark. Safety concern.', 'issue', now() - interval '7 days'),
(60.1855, 24.8240, 'I remember when this was all forest. Now it is a tech hub. Espoo evolves fast.', 'memory', now() - interval '4 days'),

-- Leppävaara area
(60.2193, 24.8114, 'Sello library is genuinely one of the best public spaces in Europe. Free, warm, inclusive.', 'love', now() - interval '13 days'),
(60.2175, 24.8058, 'Idea: pop-up art installations along the Leppävaara train station walkway. Brighten the commute!', 'idea', now() - interval '9 days'),
(60.2210, 24.8140, 'The playground near Galleria could really use some updating. Equipment is getting old.', 'issue', now() - interval '5 days'),
(60.2160, 24.8090, 'I have lived here for 30 years. Leppävaara went from a small village to a real city center.', 'memory', now() - interval '3 days'),

-- Espoon keskus area
(60.2052, 24.6567, 'The Espoo Cathedral area is so peaceful. Hidden gem for anyone who wants quiet.', 'love', now() - interval '14 days'),
(60.2070, 24.6610, 'Why is there no direct bus from Espoon keskus to Otaniemi? Two transfers feels wrong.', 'issue', now() - interval '8 days'),
(60.2035, 24.6540, 'Community garden here would be perfect. The soil is good and there is space behind the church.', 'idea', now() - interval '6 days'),

-- Matinkylä / Iso Omena area
(60.1583, 24.7399, 'Iso Omena is more than a mall now. Library, swimming hall, health center — real city hub.', 'thought', now() - interval '11 days'),
(60.1600, 24.7450, 'The waterfront walk from Matinkylä towards Suomenoja is stunning in autumn. Recommend to everyone.', 'love', now() - interval '7 days'),
(60.1570, 24.7370, 'More bike parking near the metro station please! Always full by 8am.', 'issue', now() - interval '5 days'),
(60.1610, 24.7420, 'What about a monthly neighborhood cleanup day? I would volunteer.', 'idea', now() - interval '2 days'),

-- Espoonlahti area
(60.1490, 24.6540, 'The Espoonlahti harbor is so underused. Weekend fish market? Music events in summer?', 'idea', now() - interval '10 days'),
(60.1510, 24.6580, 'My kids grew up swimming at Espoonlahti beach. Best summers of our lives.', 'memory', now() - interval '8 days'),
(60.1475, 24.6500, 'Noise from the construction on Espoonlahdenkatu is unbearable. When does it end?', 'issue', now() - interval '3 days'),

-- Kauniainen (within bounds)
(60.2100, 24.7280, 'Kauniainen feels like a village inside a city. Love the small-town atmosphere.', 'love', now() - interval '9 days'),
(60.2115, 24.7310, 'The train station needs better accessibility ramps. Difficult with a stroller.', 'issue', now() - interval '6 days'),

-- Northern Espoo
(60.2680, 24.6050, 'Central Park of Espoo is a treasure. You can walk for hours and forget you are near a city.', 'love', now() - interval '12 days'),
(60.2520, 24.5900, 'More trail markers in the Nuuksio direction would help. Got lost last weekend!', 'thought', now() - interval '4 days'),

-- Westend / Haukilahti
(60.1690, 24.7850, 'Haukilahti beach at sunset. That is all. Pure magic.', 'love', now() - interval '15 days'),
(60.1670, 24.7900, 'The small boat harbor needs better waste bins. Trash on the shore after windy days.', 'issue', now() - interval '7 days'),
(60.1710, 24.7800, 'Remember the old Westend kiosk? Best ice cream in Espoo. Miss it every summer.', 'memory', now() - interval '5 days');
