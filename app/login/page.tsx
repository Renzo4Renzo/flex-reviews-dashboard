"use client";

import {
  Container,
  Card,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Alert,
} from "@mantine/core";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconHome } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/store/authStore";

const COLORS = {
  primary: "#284E4C",
  pageBackground: "#F8F7F5",
  white: "#FFFFFF",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        login();
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.pageBackground,
        padding: "1rem",
      }}
    >
      <Container
        size="xs"
        style={{
          width: "100%",
          maxWidth: "440px",
        }}
      >
        <Card
          shadow="md"
          padding="xl"
          radius="md"
          style={{
            width: "100%",
            backgroundColor: COLORS.white,
          }}
        >
          <Stack gap="lg">
            {/* Header */}
            <div style={{ textAlign: "center" }}>
              <Stack gap="xs" align="center" mb="md">
                <IconHome size={40} color={COLORS.primary} stroke={1.5} />
                <Text
                  size="md"
                  c={COLORS.primary}
                  fw={600}
                  style={{ letterSpacing: "0.5px" }}
                >
                  The Flex
                </Text>
              </Stack>
              <Title
                order={2}
                style={{
                  textAlign: "center",
                  fontSize: "clamp(1.5rem, 5vw, 1.75rem)",
                  fontWeight: 600,
                  color: "#000",
                }}
              >
                Manager Login
              </Title>
              <Text
                c="dimmed"
                size="sm"
                mt="xs"
                style={{ textAlign: "center" }}
              >
                Access the reviews dashboard
              </Text>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                title="Login Failed"
              >
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="user@flex.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  size="md"
                  styles={{
                    input: {
                      "&:focus": {
                        borderColor: COLORS.primary,
                      },
                    },
                  }}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  size="md"
                  styles={{
                    input: {
                      "&:focus": {
                        borderColor: COLORS.primary,
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  mt="md"
                  size="md"
                  style={{
                    backgroundColor: COLORS.primary,
                  }}
                  styles={{
                    root: {
                      "&:hover": {
                        backgroundColor: "#1f3a38",
                      },
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>

            {/* Demo Credentials */}
            <div style={{ textAlign: "center" }}>
              <Text size="xs" c="dimmed" mt="lg">
                Demo credentials:
              </Text>
              <Text size="xs" c="dimmed">
                Email: <strong>manager@flex.com</strong>
              </Text>
              <Text size="xs" c="dimmed">
                Password: <strong>flex2024</strong>
              </Text>
            </div>
          </Stack>
        </Card>
      </Container>
    </div>
  );
}
