import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TYPE_COLORS } from '@/constants/Pokemon';
import { useFavorites } from '@/contexts/FavoritesContext';
import TypeBadge from '@/components/TypeBadge';

interface PokemonCardProps {
  pokemon: {
    id: number;
    name: string;
    types?: string[];
    image: string;
  };
  onPress?: () => void;
}

export default function PokemonCard({ pokemon, onPress }: PokemonCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);

  const displayName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  const primaryType = pokemon.types?.[0];
  const tintColor = primaryType ? TYPE_COLORS[primaryType] : '#A8A77A';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Gradient-like top accent */}
      <View
        style={[styles.bgAccent, { backgroundColor: tintColor }]}
      />
      <View style={styles.bgAccentOverlay} />

      {/* Favorite button */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => toggleFavorite(pokemon.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.6}
      >
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={22}
          color={favorite ? '#FFCB05' : 'rgba(255,255,255,0.5)'}
        />
      </TouchableOpacity>

      {/* Pokemon ID */}
      <Text style={styles.idText}>{formattedId}</Text>

      {/* Pokemon Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Pokemon Name */}
      <Text style={styles.name} numberOfLines={1}>
        {displayName}
      </Text>

      {/* Type badges */}
      {pokemon.types && pokemon.types.length > 0 && (
        <View style={styles.typesRow}>
          {pokemon.types.map((type) => (
            <View key={type} style={styles.typeBadgeWrapper}>
              <TypeBadge type={type} size="small" />
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2D4A',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  bgAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderRadius: 20,
    opacity: 0.2,
  },
  bgAccentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
  },
  idText: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    color: '#FFCB05',
    marginBottom: 2,
    opacity: 0.8,
  },
  imageContainer: {
    width: 96,
    height: 96,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 88,
    height: 88,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
    marginBottom: 6,
    textAlign: 'center',
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  typeBadgeWrapper: {
    marginHorizontal: 1,
  },
});
