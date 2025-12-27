import { ReactNode } from "react";
import { Container, Group, Text, Stack, Box, ActionIcon, SimpleGrid } from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconInfoCircle,
  IconCurrencyPound,
  IconHome,
  IconPhone,
  IconMail,
  IconSend,
  IconBuilding,
  IconBook,
  IconMailFilled,
} from "@tabler/icons-react";

interface PropertyPageLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { icon: IconBuilding, label: "Landlords" },
  { icon: IconInfoCircle, label: "About Us" },
  { icon: IconBook, label: "Careers" },
  { icon: IconMailFilled, label: "Contact" },
  { label: "English", isFlag: true },
  { icon: IconCurrencyPound, label: "GBP" },
] as const;

const FOOTER_COLUMNS = {
  quickLinks: ["Blog", "Careers", "Terms & Conditions", "Privacy Policy"],
  locations: ["LONDON", "PARIS", "ALGIERS"],
  supportNumbers: [
    { country: "United Kingdom", phone: "+44 77 2374 5546", flag: "🇬🇧" },
    { country: "Algeria", phone: "+337 31 99 22 41", flag: "🇩🇿" },
    { country: "Paris", phone: "+33 6 64 57 17", flag: "🇫🇷" },
  ],
};

const COLORS = {
  primary: "#284E4C",
  whatsapp: "#25D366",
  white: "white",
  whiteTransparent: "rgba(255,255,255,0.7)",
  whiteLight: "rgba(255,255,255,0.5)",
  border: "rgba(255,255,255,0.3)",
};

function Header() {
  return (
    <header
      style={{
        backgroundColor: COLORS.primary,
        padding: "1rem 0",
        borderBottom: "1px solid #1f3a38",
      }}
    >
      <Container size="xl">
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="xs">
            <IconHome size={24} color="white" stroke={1.5} />
            <Text
              size="md"
              fw={400}
              c="white"
              style={{ letterSpacing: "0.5px" }}
            >
              The Flex
            </Text>
          </Group>

          <Group gap="md" wrap="wrap" style={{ rowGap: "0.5rem" }}>
            {NAV_ITEMS.map((item) => (
              <Group key={item.label} gap="xs" style={{ cursor: "pointer" }}>
                {"isFlag" in item ? (
                  <Text size="sm">🇬🇧</Text>
                ) : (
                  <item.icon size={16} color="white" stroke={2} />
                )}
                <Text size="sm" c="white" style={{ whiteSpace: "nowrap" }}>
                  {item.label}
                </Text>
              </Group>
            ))}
          </Group>
        </Group>
      </Container>
    </header>
  );
}

function NewsletterForm() {
  const inputStyle = {
    padding: "0.65rem 0.75rem",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "4px",
    backgroundColor: "transparent",
    color: "white",
    fontSize: "14px",
    height: "40px",
    boxSizing: "border-box" as const,
    width: "100%",
  };

  return (
    <Stack gap="sm" style={{ maxWidth: "296px", width: "100%" }}>
      <Group gap="8px" wrap="nowrap" style={{ width: "100%" }}>
        <input
          type="text"
          placeholder="First name"
          style={{ ...inputStyle, flex: 1, minWidth: 0 }}
        />
        <input
          type="text"
          placeholder="Last name"
          style={{ ...inputStyle, flex: 1, minWidth: 0 }}
        />
      </Group>
      <input
        type="email"
        placeholder="Email address"
        style={inputStyle}
      />
      <Group gap="8px" wrap="nowrap" style={{ width: "100%" }}>
        <select
          style={{
            ...inputStyle,
            width: "80px",
            flex: "0 0 80px",
            color: COLORS.whiteTransparent,
          }}
        >
          <option>+44</option>
        </select>
        <input
          type="tel"
          placeholder="Phone number"
          style={{ ...inputStyle, flex: 1, minWidth: 0 }}
        />
      </Group>
      <button
        style={{
          padding: "0.65rem 1.5rem",
          backgroundColor: "white",
          color: COLORS.primary,
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxSizing: "border-box",
        }}
      >
        <IconSend size={16} />
        Subscribe
      </button>
    </Stack>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: COLORS.primary,
        padding: "3rem 1rem 2rem",
        marginTop: "auto",
      }}
    >
      <Container size="xl">
        <SimpleGrid
          cols={{ base: 1, xs: 2, sm: 3, md: 5 }}
          spacing={{ base: "xl", sm: "lg" }}
          mb="xl"
        >
          {/* Join The Flex */}
          <Box>
            <Text size="md" fw={600} c="white" mb="md">
              Join The Flex
            </Text>
            <Text
              size="sm"
              c={COLORS.whiteTransparent}
              mb="lg"
              style={{ lineHeight: 1.6 }}
            >
              Sign up now and stay up to date on our latest news and
              exclusive offers! 5% off your first stay!
            </Text>
            <NewsletterForm />
          </Box>

          {/* The Flex */}
          <Box>
            <Text size="md" fw={600} c="white" mb="md">
              The Flex
            </Text>
            <Text
              size="sm"
              c={COLORS.whiteTransparent}
              style={{ lineHeight: 1.7 }}
            >
              Professional property management services for landlords, flexible
              corporate lets for businesses, and quality accommodations for
              short-term and long-term guests.
            </Text>
            <Group gap="sm" mt="md">
              <ActionIcon
                size="lg"
                variant="transparent"
                c="white"
                style={{ cursor: "pointer" }}
              >
                <IconBrandFacebook size={20} />
              </ActionIcon>
              <ActionIcon
                size="lg"
                variant="transparent"
                c="white"
                style={{ cursor: "pointer" }}
              >
                <IconBrandInstagram size={20} />
              </ActionIcon>
              <ActionIcon
                size="lg"
                variant="transparent"
                c="white"
                style={{ cursor: "pointer" }}
              >
                <IconBrandLinkedin size={20} />
              </ActionIcon>
            </Group>
          </Box>

          {/* Quick Links */}
          <Box>
            <Text size="md" fw={600} c="white" mb="md">
              Quick Links
            </Text>
            <Stack gap="xs">
              {FOOTER_COLUMNS.quickLinks.map((link) => (
                <Text
                  key={link}
                  size="sm"
                  c={COLORS.whiteTransparent}
                  style={{ cursor: "pointer" }}
                >
                  {link}
                </Text>
              ))}
            </Stack>
          </Box>

          {/* Locations */}
          <Box>
            <Text size="md" fw={600} c="white" mb="md">
              Locations
            </Text>
            <Stack gap="xs">
              {FOOTER_COLUMNS.locations.map((location) => (
                <Text key={location} size="sm" c={COLORS.whiteTransparent}>
                  {location}
                </Text>
              ))}
            </Stack>
          </Box>

          {/* Contact Us */}
          <Box>
            <Text size="md" fw={600} c="white" mb="md">
              Contact Us
            </Text>
            <Stack gap="md">
              <Box>
                <Group gap="xs" mb="xs">
                  <IconPhone size={16} color={COLORS.whiteTransparent} />
                  <Text size="sm" c={COLORS.whiteTransparent} fw={500}>
                    Support Numbers
                  </Text>
                </Group>
                <Stack gap="sm">
                  {FOOTER_COLUMNS.supportNumbers.map(
                    ({ country, phone, flag }) => (
                      <Box key={country}>
                        <Group gap="xs" mb={4}>
                          <Text size="sm">{flag}</Text>
                          <Text size="xs" c={COLORS.whiteLight}>
                            {country}
                          </Text>
                        </Group>
                        <Text size="xs" c={COLORS.whiteTransparent} pl="xl">
                          {phone}
                        </Text>
                      </Box>
                    )
                  )}
                </Stack>
              </Box>
              <Group gap="xs">
                <IconMail size={16} color={COLORS.whiteTransparent} />
                <Text size="xs" c={COLORS.whiteTransparent}>
                  info@theflex.global
                </Text>
              </Group>
            </Stack>
          </Box>
        </SimpleGrid>

        <Text size="xs" c={COLORS.whiteLight} ta="center" mt="lg">
          © {currentYear} The Flex. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}

function WhatsAppButton() {
  return (
    <ActionIcon
      size={56}
      radius="xl"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        backgroundColor: COLORS.whatsapp,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      <IconBrandWhatsapp size={32} color="white" />
    </ActionIcon>
  );
}

export default function PropertyPageLayout({
  children,
}: PropertyPageLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
