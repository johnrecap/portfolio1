# Site Copy Refresh Spec

## Summary

Define and execute a complete refresh of the public-facing site copy in Arabic and English so Mohamed Studio sounds personal, simple, and client-focused instead of polished in a generic or AI-coded way.

## Problem

The current public copy is serviceable but uneven. Some sections are grounded, while others sound too broad, too promotional, or too detached from a real person speaking to potential clients.

The issue is not limited to one file or one page:

- Public copy is split across locale files, public-section fallbacks, site/footer/SEO defaults, and Firestore-backed page content.
- Some strings explain capability without making the client benefit clear.
- Some text sounds more like generic product marketing than a working freelancer or product engineer speaking plainly.
- Arabic and English are not always equally natural in rhythm or phrasing.
- Copy updates can be missed easily because the public site has multiple fallback layers.

## Goals

- Establish one editorial direction for the public site in Arabic and English.
- Make the tone personal, simple, direct, and professional.
- Prioritize clients as the primary audience for the public-facing copy.
- Remove inflated, vague, and AI-sounding phrasing from the reviewed scope.
- Cover every public section and supporting public string through one tracked packet so nothing is missed.
- Define where each public string comes from so implementation knows what must change in code versus what may need dashboard content updates.

## Non-Goals

- Rewriting dashboard/admin copy
- Redesigning page layouts or visual components
- Changing public route structure or information architecture
- Turning the site into highly sales-driven or slogan-heavy marketing copy
- Forcing Arabic to be a literal translation of English, or vice versa
- Editing live Firestore content directly from this packet

## User Scenarios & Testing

### User Story 1 - A Client Understands the Offer Quickly (Priority: P1)

As a potential client, I want the homepage and key public sections to explain clearly what Mohamed does, what kinds of work he takes on, and why I might contact him.

**Why this priority**: The highest-value copy is the text that helps a client decide whether this site and this person are relevant to their project.

**Independent Test**: Review the homepage and public top-level pages in Arabic and English and confirm the offer is clear without reading like generic portfolio marketing.

**Acceptance Scenarios**:

1. **Given** a first-time visitor lands on the homepage, **When** they read the hero and supporting sections, **Then** they should understand the type of work offered without needing extra interpretation.
2. **Given** a client reaches the contact page, **When** they read the intro, availability, and form labels, **Then** the experience should feel practical and credible rather than over-polished.

### User Story 2 - Public Sections Share One Natural Voice (Priority: P1)

As a visitor browsing across pages, I want the site to sound like one person with a clear voice rather than a mix of strong writing and generic filler.

**Why this priority**: Consistency is what prevents a copy refresh from feeling partial or artificial.

**Independent Test**: Review the public sections covered by this packet and confirm the tone stays consistent across hero, about, projects, skills, blog, services, contact, and footer.

**Acceptance Scenarios**:

1. **Given** a visitor moves from the homepage to about, projects, and contact, **When** they read each section, **Then** the wording should feel consistent in tone and level of formality.
2. **Given** the Arabic and English versions of the same section, **When** they are compared, **Then** they should match in intent and warmth without sounding like literal translations.

### User Story 3 - A Maintainer Can Update All Public Copy Sources Reliably (Priority: P2)

As the maintainer, I want one packet that identifies every public copy source and the work needed in each layer so implementation does not leave stale text behind.

**Why this priority**: The site uses more than one copy source, so a content refresh can easily become incomplete if the source map is vague.

**Independent Test**: Read the packet and confirm it covers locale strings, public fallback defaults, SEO/public settings defaults, and any Firestore-backed overrides that may need follow-up review.

**Acceptance Scenarios**:

1. **Given** a maintainer follows the tasks list, **When** they execute the packet, **Then** no reviewed public section should be skipped because its text lived outside `src/locales/*.json`.
2. **Given** some public text is stored in Firestore-backed settings or composer content, **When** the packet is reviewed, **Then** it must clearly identify that code fallback edits alone may not update the live site.

## Edge Cases

- Some public text may currently come from Firestore page-composer content and therefore override updated locale fallbacks.
- Site, footer, contact, and SEO defaults may expose older tone even when locale strings are refreshed.
- Arabic may need different sentence order or phrasing to sound natural while preserving the same client-facing meaning.
- Buttons, cards, chips, and empty states have tighter space constraints than long-form section copy.
- Some strings are small but visible, such as navigation labels, CTA labels, search placeholders, FAQ headings, and empty states.
- A copy pass that improves the homepage only may still leave the overall site feeling inconsistent.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST define one Speckit packet for the public-site copy refresh under `specs/012-site-copy-refresh/`.
- **FR-002**: The packet MUST define the target audience as clients first.
- **FR-003**: The packet MUST define the target tone as personal, simple, direct, and professional.
- **FR-004**: The packet MUST define anti-patterns to remove, including inflated claims, vague product-speak, filler wording, and AI-sounding phrasing.
- **FR-005**: The packet MUST include a source map of public copy origins, including locale files, public fallback layers, site/footer/contact/SEO defaults, and Firestore-backed public content overrides where relevant.
- **FR-006**: The packet MUST cover the following public content areas: `hero`, `about`, `projects`, `skills`, `blog`, `services`, `contact`, `footer`, and supporting public labels or empty states that materially affect the visitor experience.
- **FR-007**: The packet MUST explicitly exclude dashboard/admin copy from scope.
- **FR-008**: The packet MUST define a section-by-section rewrite checklist so no public section is skipped during implementation.
- **FR-009**: The packet MUST require Arabic and English review as parallel writing passes, not literal translations.
- **FR-010**: The packet MUST identify where implementation may need manual dashboard-content review because Firestore-managed content can override repository fallback copy.
- **FR-011**: The packet MUST define verification steps for both language parity and layout-fit risk on the public site.

### Key Entities

- **Editorial Tone Guide**: The approved voice and anti-pattern rules for public-facing Arabic and English copy.
- **Public Copy Source Map**: The inventory of where public strings originate across locale files, defaults, and Firestore-backed content.
- **Section Rewrite Checklist**: The ordered list of public sections and supporting strings that must be reviewed so the refresh stays complete.

## Success Criteria

- **SC-001**: The packet makes it possible to review every major public section without relying on memory or ad hoc search.
- **SC-002**: The approved tone direction is explicit enough that implementation can distinguish strong copy from generic AI-sounding copy.
- **SC-003**: The packet clearly distinguishes repo-controlled fallback copy from Firestore-managed public content that may need manual follow-up.
- **SC-004**: The packet gives maintainers a concrete sequence for rewriting, checking, and verifying Arabic and English public copy without drifting into dashboard/admin scope.
