const phoneRegex = {
    'am': /^374\d{8}$/,          // Armenia: 8 digits after country code 374
    'ae': /^971\d{9}$/,          // UAE: 9 digits after country code 971
    'bh': /^973\d{8}$/,          // Bahrain: 8 digits after country code 973
    'dz': /^213\d{9}$/,          // Algeria: 9 digits after country code 213
    'eg': /^20\d{10}$/,          // Egypt: 10 digits after country code 20
    'iq': /^964\d{10}$/,         // Iraq: 10 digits after country code 964
    'jo': /^962\d{9}$/,          // Jordan: 9 digits after country code 962
    'kw': /^965\d{8}$/,          // Kuwait: 8 digits after country code 965
    'sa': /^966\d{9}$/,          // Saudi Arabia: 9 digits after country code 966
    'sy': /^963\d{9}$/,          // Syria: 9 digits after country code 963
    'tn': /^216\d{8}$/,          // Tunisia: 8 digits after country code 216
    'by': /^375\d{9}$/,          // Belarus: 9 digits after country code 375
    'bg': /^359\d{9}$/,          // Bulgaria: 9 digits after country code 359
    'bd': /^880\d{10}$/,         // Bangladesh: 10 digits after country code 880
    'cz': /^420\d{9}$/,          // Czech Republic: 9 digits after country code 420
    'dk': /^45\d{8}$/,           // Denmark: 8 digits after country code 45
    'de': /^49\d{11}$/,          // Germany: 11 digits after country code 49
    'at': /^43\d{10,15}$/,       // Austria: 10 to 15 digits after country code 43
    'gr': /^30\d{10}$/,          // Greece: 10 digits after country code 30
    'au': /^61\d{9}$/,           // Australia: 9 digits after country code 61
    'gb': /^44\d{10}$/,          // UK: 10 digits after country code 44
    'gg': /^44\d{10}$/,          // Guernsey: 10 digits after country code 44
    'gh': /^233\d{9}$/,          // Ghana: 9 digits after country code 233
    'hk': /^852\d{8}$/,          // Hong Kong: 8 digits after country code 852
    'mo': /^853\d{8}$/,          // Macau: 8 digits after country code 853
    'ie': /^353\d{9}$/,          // Ireland: 9 digits after country code 353
    'in': /^91\d{10}$/,          // India: 10 digits after country code 91
    'ke': /^254\d{10}$/,         // Kenya: 10 digits after country code 254
    'mt': /^356\d{8}$/,          // Malta: 8 digits after country code 356
    'mu': /^230\d{8}$/,          // Mauritius: 8 digits after country code 230
    'ng': /^234\d{10}$/,         // Nigeria: 10 digits after country code 234
    'nz': /^64\d{9,10}$/,        // New Zealand: 9 or 10 digits after country code 64
    'pk': /^92\d{10}$/,          // Pakistan: 10 digits after country code 92
    'rw': /^250\d{9}$/,          // Rwanda: 9 digits after country code 250
    'sg': /^65\d{8}$/,           // Singapore: 8 digits after country code 65
    'sl': /^94\d{7}$/,           // Sri Lanka: 7 digits after country code 94
    'tz': /^255\d{9}$/,          // Tanzania: 9 digits after country code 255
    'ug': /^256\d{9}$/,          // Uganda: 9 digits after country code 256
    'us': /^1\d{10}$/,           // US: 10 digits after country code 1
    'za': /^27\d{9}$/,           // South Africa: 9 digits after country code 27
    'zm': /^260\d{9}$/,          // Zambia: 9 digits after country code 260
    'cl': /^56\d{9}$/,           // Chile: 9 digits after country code 56
    'ec': /^593\d{9}$/,          // Ecuador: 9 digits after country code 593
    'es': /^34\d{9}$/,           // Spain: 9 digits after country code 34
    'mx': /^52\d{10,11}$/,       // Mexico: 10 or 11 digits after country code 52
    'pa': /^507\d{7,8}$/,        // Panama: 7 or 8 digits after country code 507
    'py': /^595\d{9}$/,          // Paraguay: 9 digits after country code 595
    'uy': /^598\d{8}$/,          // Uruguay: 8 digits after country code 598
    'ee': /^372\d{7,8}$/,        // Estonia: 7 or 8 digits after country code 372
    'ir': /^98\d{10}$/,          // Iran: 10 digits after country code 98
    'fi': /^358\d{8,10}$/,       // Finland: 8 to 10 digits after country code 358
    'fj': /^679\d{7}$/,          // Fiji: 7 digits after country code 679
    'fo': /^298\d{8}$/,          // Faroe Islands: 8 digits after country code 298
    'fr': /^33\d{9}$/,           // France: 9 digits after country code 33
    'gf': /^594\d{9}$/,          // French Guiana: 9 digits after country code 594
    'gp': /^590\d{9}$/,          // Guadeloupe: 9 digits after country code 590
    'mq': /^596\d{9}$/,          // Martinique: 9 digits after country code 596
    're': /^262\d{9}$/,          // Réunion: 9 digits after country code 262
    'il': /^972\d{9}$/,          // Israel: 9 digits after country code 972
    'hu': /^36\d{9}$/,           // Hungary: 9 digits after country code 36
    'id': /^62\d{9,12}$/,        // Indonesia: 9 to 12 digits after country code 62
    'it': /^39\d{9,10}$/,        // Italy: 9 or 10 digits after country code 39
    'jp': /^81\d{10}$/,          // Japan: 10 digits after country code 81
    'kz': /^7\d{10}$/,           // Kazakhstan: 10 digits after country code 7
    'gl': /^299\d{6}$/,          // Greenland: 6 digits after country code 299
    'kr': /^82\d{9,10}$/,        // South Korea: 9 or 10 digits after country code 82
    'lt': /^370\d{8}$/,          // Lithuania: 8 digits after country code 370
    'my': /^60\d{7,8}$/,         // Malaysia: 7 or 8 digits after country code 60
    'no': /^47\d{8}$/,           // Norway: 8 digits after country code 47
    'np': /^977\d{10}$/,         // Nepal: 10 digits after country code 977
    'be': /^32\d{9}$/,           // Belgium: 9 digits after country code 32
    'nl': /^31\d{9}$/,           // Netherlands: 9 digits after country code 31
    'pl': /^48\d{9}$/,           // Poland: 9 digits after country code 48
    'br': /^55\d{10}$/,          // Brazil: 10 digits after country code 55
    'pt': /^351\d{9}$/,          // Portugal: 9 digits after country code 351
    'ro': /^40\d{8}$/,           // Romania: 8 digits after country code 40
    'ru': /^7\d{10}$/,           // Russia: 10 digits after country code 7
    'si': /^386\d{8}$/,          // Slovenia: 8 digits after country code 386
    'sk': /^421\d{9}$/,          // Slovakia: 9 digits after country code 421
    'rs': /^381\d{9}$/,          // Serbia: 9 digits after country code 381
    'se': /^46\d{9}$/,           // Sweden: 9 digits after country code 46
    'ch': /^41\d{9}$/,           // Switzerland: 9 digits after country code 41
    'ua': /^380\d{9}$/,          // Ukraine: 9 digits after country code 380
    'ad': /^376\d{6}$/,          // Andorra: 6 digits after country code 376
    'ar': /^54\d{10}$/,          // Argentina: 10 digits after country code 54
    'as': /^1684\d{7}$/,         // American Samoa: 7 digits after country code 1684
    'bb': /^1246\d{7}$/,         // Barbados: 7 digits after country code 1246
    'bf': /^226\d{8}$/,          // Burkina Faso: 8 digits after country code 226
    'bi': /^257\d{8}$/,          // Burundi: 8 digits after country code 257
    'cv': /^238\d{7}$/,          // Cape Verde: 7 digits after country code 238
    'cy': /^357\d{8}$/,          // Cyprus: 8 digits after country code 357
    'dm': /^1767\d{7}$/,         // Dominica: 7 digits after country code 1767
    'do': /^1809\d{7,8}$/,       // Dominican Republic: 7 or 8 digits after country code 1809
    'ht': /^509\d{8}$/,          // Haiti: 8 digits after country code 509
    'kn': /^1869\d{7}$/,         // Saint Kitts and Nevis: 7 digits after country code 1869
    'lc': /^1758\d{7}$/,         // Saint Lucia: 7 digits after country code 1758
    'vc': /^1784\d{7}$/,         // Saint Vincent and the Grenadines: 7 digits after country code 1784
    'ws': /^685\d{5}$/,          // Samoa: 5 digits after country code 685
    'st': /^239\d{7}$/,          // São Tomé and Príncipe: 7 digits after country code 239
    'sh': /^290\d{4}$/,          // Saint Helena: 4 digits after country code 290
    'tl': /^670\d{7}$/,          // Timor-Leste: 7 digits after country code 670
    'to': /^676\d{4}$/,          // Tonga: 4 digits after country code 676
    'tv': /^688\d{4}$/,          // Tuvalu: 4 digits after country code 688
    'vg': /^1284\d{7}$/,         // British Virgin Islands: 7 digits after country code 1284
    'wf': /^681\d{5}$/,          // Wallis and Futuna: 5 digits after country code 681
    'yt': /^262\d{9}$/,          // Mayotte: 9 digits after country code 262
    'zw': /^263\d{9}$/,          // Zimbabwe: 9 digits after country code 263
};
