import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TypeBadge from '@/components/TypeBadge';
import { useFavorites } from '@/contexts/FavoritesContext';
import {
  POKEAPI_BASE_URL,
  getPokemonImageUrl,
  TYPE_COLORS,
  PokemonDetail,
} from '@/constants/Pokemon';

const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'โจมตี',
  defense: 'ป้องกัน',
  'special-attack': 'โจมตีพิเศษ',
  'special-defense': 'ป้องกันพิเศษ',
  speed: 'ความเร็ว',
};

const STAT_COLORS: Record<string, string> = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2',
};

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const pokemonId = Number(id);
  const favorite = isFavorite(pokemonId);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.error('Failed to fetch Pokemon detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFCB05" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>ไม่สามารถโหลดข้อมูลได้</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const primaryColor = TYPE_COLORS[primaryType] || '#A8A77A';
  const displayName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  return (
    <>
      <Stack.Screen
        options={{
          title: displayName,
          headerStyle: { backgroundColor: '#0F1F3D' },
          headerTintColor: '#FFCB05',
          headerTitleStyle: { fontWeight: '800', color: '#FFCB05' },
        }}
      />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.heroBg, { backgroundColor: primaryColor }]} />

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(pokemonId)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={30}
              color={favorite ? '#FFCB05' : 'rgba(255,255,255,0.5)'}
            />
          </TouchableOpacity>

          <Text style={styles.heroId}>{formattedId}</Text>
          <Image
            source={{ uri: getPokemonImageUrl(pokemon.id) }}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <Text style={styles.heroName}>{displayName}</Text>

          {/* Type Badges */}
          <View style={styles.typesRow}>
            {pokemon.types.map((t) => (
              <TypeBadge
                key={t.type.name}
                type={t.type.name}
                size="medium"
                onPress={() => router.push(`/type/${t.type.name}`)}
              />
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="resize-outline" size={22} color="#FFCB05" />
              <Text style={styles.infoLabel}>สูง</Text>
              <Text style={styles.infoValue}>
                {(pokemon.height / 10).toFixed(1)} m
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Ionicons name="barbell-outline" size={22} color="#FFCB05" />
              <Text style={styles.infoLabel}>หนัก</Text>
              <Text style={styles.infoValue}>
                {(pokemon.weight / 10).toFixed(1)} kg
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>สถิติพื้นฐาน</Text>
          {pokemon.stats.map((stat) => {
            const statName = STAT_NAMES[stat.stat.name] || stat.stat.name;
            const statColor = STAT_COLORS[stat.stat.name] || '#999';
            const percentage = Math.min((stat.base_stat / 255) * 100, 100);

            return (
              <View key={stat.stat.name} style={styles.statRow}>
                <Text style={styles.statName}>{statName}</Text>
                <Text style={styles.statValue}>{stat.base_stat}</Text>
                <View style={styles.statBarBg}>
                  <View
                    style={[
                      styles.statBarFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: statColor,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Abilities Section */}
        <View style={[styles.section, { marginBottom: 32 }]}>
          <Text style={styles.sectionTitle}>ความสามารถ</Text>
          {pokemon.abilities.map((a) => {
            const abilityName =
              a.ability.name.charAt(0).toUpperCase() +
              a.ability.name.slice(1).replace('-', ' ');
            return (
              <View key={a.ability.name} style={styles.abilityItem}>
                <Ionicons name="flash" size={16} color="#FFCB05" />
                <Text style={styles.abilityText}>{abilityName}</Text>
                {a.is_hidden && (
                  <View style={styles.hiddenBadge}>
                    <Text style={styles.hiddenText}>ซ่อน</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1929',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1929',
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.3)',
  },
  heroId: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFCB05',
    marginBottom: 4,
    opacity: 0.7,
  },
  heroImage: {
    width: 220,
    height: 220,
  },
  heroName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginTop: 8,
    letterSpacing: 1,
  },
  typesRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  infoSection: {
    marginHorizontal: 16,
    marginTop: -12,
    backgroundColor: '#1E2D4A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(255,203,5,0.2)',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginTop: 2,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#1E2D4A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFCB05',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    width: 95,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  statValue: {
    width: 38,
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'right',
    marginRight: 12,
  },
  statBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  abilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  abilityText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
  },
  hiddenBadge: {
    backgroundColor: 'rgba(255,203,5,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.3)',
  },
  hiddenText: {
    fontSize: 11,
    color: '#FFCB05',
    fontWeight: '700',
  },
});
