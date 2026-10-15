# 2026-10-15

*Features*

- Added an output schema and descriptions of the dataset fields

*Fixes*

- Read products from Zalando's new page data, so runs return items again instead of none
- Removed `comingSoon` from the output (Zalando no longer provides it)
- A run that finds no products now ends as failed, with a message
- Upgraded to Node 22, Apify SDK 3.7 and Crawlee 3.18

# 2023-10-26

*Fixes*

- Removed user ratings and reviews from the output (Zalando no longer provides them)
